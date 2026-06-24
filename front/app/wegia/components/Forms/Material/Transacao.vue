<template>
  <section>
    <BreadCrumbTimeLine
      :steps="etapas"
      :currentStep="etapaAtual"
      @navigate="handleStepChange"
    />

    <div>
      <Forms
        v-if="etapaAtual === 1"
        :formulario="formulario"
        @enviar-formulario="enviarPrimeiroFormulario"
      />

      <div v-else-if="etapaAtual === 2">
        <Forms
          :formulario="segundoFormulario"
          @enviar-formulario="enviar"
        >
          <template #botao>
            <Butao
              texto="Adicionar"
              classExtra="sucesso"
              class="botao-adicionar"
              @click-botao="adicionarProduto"
            />
          </template>
        </Forms>

        <section class="tabela-produtos">
          <tabela-schema
            titulo="Produtos adicionados"
            :isLoading="false"
            :paginacao="null"
            :atualizacao="0"
            :mostrarPaginacao="false"
            :mostrarFiltros="false"
            :linhas="produtosAdicionados"
            :cabecalhos="[
              { nome: 'Produto', chave: 'descricao', ordenavel: false },
              { nome: 'Quantidade', chave: 'quantidade', ordenavel: false },
              { nome: 'Valor Unitário', chave: 'valor_unitario', ordenavel: false },
              { nome: 'Ação', chave: 'acao', ordenavel: false }
            ]"
            :acao="['deletar']"
            @excluir="deletarProduto"
          />
        </section>
      </div>
    </div>
  </section>

  <modal-cadastrar-material-parceiro
    v-if="modalParceiro"
    :titulo="tipoMovimentacao === 'e' ? 'Origem' : 'Saída'"
    @fechar-modal="materialParceiroStore.setAbrirModal"
    @buscar="materialParceiroStore.fetchParceiroParaFiltros"
  />

  <modal-cadastrar-base-cadastro-texto
    v-if="modalAlmoxarifado"
    texto="Cadastrar Almoxarifado"
    placeholder="Nome Almoxarifado"
    @enviar-modal="cadastrarAlmoxarifado"
    @fechar-modal="materialAlmoxarifadoStore.setAbrirModal"
  />

  <modal-cadastrar-material-tipo-movimentacao
    v-if="modalTipoMovimentacao"
    titulo="tipo de entrada"
    :tipo="tipoMovimentacao"
    @buscar="buscarTipoMovimentacao"
    @fechar-modal="materialTipoMovimentacaoStore.setAbrirModal"
  />

  <modal-cadastrar-material-produto
    v-if="modalProduto"
    :produto="null"
    @buscar="materialProdutoStore.fetchProdutosParaFiltros"
    @fechar-modal="materialProdutoStore.setAbrirModal"
  />

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'
import { cadastrarTransacao, cadastrarTransacaoProduto, enviarTransacoes } from '~/forms/Material/Transacao'

const props = defineProps<{
  tipoMovimentacao: TipoMovimentacaoEnum
}>()

const alertStore = useAlertStore()
const materialTipoMovimentacaoStore = useMaterialTipoMovimentacaoStore()
const materialParceiroStore = useMaterialParceiroStore()
const materialAlmoxarifadoStore = useMaterialAlmoxarifadoStore()
const materialProdutoStore = useMaterialProdutoStore()

const etapas = ref([
  { label: 'Cadastrar Produto', icon: '' }
])
const etapaAtual = ref(1)

const formulario = ref(cadastrarTransacao)
const segundoFormulario = ref(cadastrarTransacaoProduto)
const produtosAdicionados = ref<any[]>([])

const modalParceiro = computed(() => materialParceiroStore.getModalAberto)
const modalAlmoxarifado = computed(() => materialAlmoxarifadoStore.getModalAberto)
const modalTipoMovimentacao = computed(() => materialTipoMovimentacaoStore.getModalAberto)
const modalProduto = computed(() => materialProdutoStore.getModalAberto)

const enviarPrimeiroFormulario = async () => {
  const validacao = await ValidateForm.validate([formulario.value])
  if (!validacao) return
  etapaAtual.value++
}

const adicionarProduto = async () => {
  const valido = await ValidateForm.validate([segundoFormulario.value])
  if (!valido) return alertStore.mostrarAlerta('info', 'Preencha todos os campos!')

  const produtoForm = formatFormToJson([segundoFormulario.value])

  const produtoExistente = produtosAdicionados.value.some(
    (p) => p.id_produto == produtoForm.id_produto
  )

  if (produtoExistente) {
    alertStore.mostrarAlerta('warning', 'Este produto já foi adicionado!')
    return
  }

  const produtoSelecionado = materialProdutoStore.getProdutoParaFiltrosParaSelect.find(
    (p: any) => p.value == produtoForm.id_produto
  )

  const produtoNome = produtoSelecionado ? produtoSelecionado.texto : 'Produto desconhecido'

  produtosAdicionados.value.push({
    ...produtoForm,
    descricao: produtoNome,
  })

  materialProdutoStore.setProdutoUsado(produtoForm.id_produto)
  limparCampos([segundoFormulario.value])
}

const deletarProduto = (linha: MaterialProdutoInterface) => {
  produtosAdicionados.value = produtosAdicionados.value.filter((p: any) => p !== linha)
  materialProdutoStore.setRemoverProdutoUsado(linha.id_produto)
}

const enviar = async () => {
  try {
    const data = await enviarTransacoes(formulario.value, produtosAdicionados.value)

    if(data.status === 200) {
      materialProdutoStore.setZerarProdutosUsados()
      return etapaAtual.value = 1
    }

  } catch (e) {
    const err = e as FetchError<ErroApiInterface>

    const mensagemEstoque = err.response?._data?.errors?.produtos?.find(
      (msg: string) => msg.includes('sem estoque suficiente')
    );

    if (mensagemEstoque) {
      setErroPorNome(segundoFormulario.value, 'quantidade', mensagemEstoque)
    }
  }
}

const cadastrarAlmoxarifado = async (descricao: string) => {
  try {
    await materialAlmoxarifadoStore.fetchCadastrarAlmoxafarifado({ descricao })
    alertStore.mostrarAlerta('success', `Almoxarifado cadastrado com sucesso!`)

    await materialAlmoxarifadoStore.fetchAlmoxarifadoParaFiltros()
    materialAlmoxarifadoStore.setAbrirModal()
  } catch(e) {
    console.error('Erro:', e)
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.descricao?.some((msg : string) => msg.includes('único'))) {
      alertStore.mostrarAlerta('error', `Descrição ja existe!`)
    }

  }
}

const handleStepChange = (index: number) => {
  if (index + 1 <= etapaAtual.value) etapaAtual.value = index + 1
}

const buscarTipoMovimentacao = async () => {
  const params: Partial<MaterialTipoMovimentacaoParaFiltrosParamsInterface> = {}
  if (props.tipoMovimentacao) params.tipo = props.tipoMovimentacao
  await materialTipoMovimentacaoStore.fetchTipoMovimentacaoParaFiltros(params)
  materialTipoMovimentacaoStore.setTipoDeMovimentacaoFiltros(props.tipoMovimentacao)
}

onMounted(async () => {
  if (
    !materialTipoMovimentacaoStore.getTipoMovimentacaoParaFiltrosParaSelect.length &&
    materialTipoMovimentacaoStore.getTipoDeMovimentacaoFiltros !== props.tipoMovimentacao
  ) buscarTipoMovimentacao()

  if (!materialParceiroStore.getParceiroParaFiltrosParaSelect.length) await materialParceiroStore.fetchParceiroParaFiltros()
  if (!materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect.length) await materialAlmoxarifadoStore.fetchAlmoxarifadoParaFiltros()
  if (!materialProdutoStore.getProdutoParaFiltrosParaSelect.length) await materialProdutoStore.fetchProdutosParaFiltros()

  materialProdutoStore.setZerarProdutosUsados()

  if(props.tipoMovimentacao === TipoMovimentacaoEnum.SAIDA) {
    etapas.value.unshift({ label: 'Cadastrar Saida', icon: '' });
    mudandoCampoNoForm(
      formulario.value,
      'id_parceiro',
      'label',
      'Saida'
    )
  } else {
    etapas.value.unshift({ label: 'Cadastrar Entrada', icon: '' });
  }
})

onUnmounted(() => {
  limparCampos([formulario.value])
  limparCampos([segundoFormulario.value])
  produtosAdicionados.value  = []
})
</script>

<style scoped>
.botao-adicionar {
  width: 120px;
}
.tabela-produtos {
  margin-top: 1rem;
}
</style>

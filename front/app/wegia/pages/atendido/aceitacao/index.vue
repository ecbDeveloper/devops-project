<template>
  <section class="tabela-atendido-aceitacao">

    <Butao
      class="novo-processo"
      texto="Novo Processo"
      @click="modalCadastrarAberto = true"
      v-if="pessoaStore.possuiPermissao(Permissao.SINCRONIZAR_PAGAMENTO)"
    />

    <tabela-schema
      titulo="Aceitação de Atendidos"
      :isLoading="isLoading"
      :paginacao="aceitacao"
      :linhas="aceitacao?.items ?? []"
      :cabecalhos="[
          { nome: 'Nome', chave: 'nome', ordenavel: false },
          { nome: 'CPF', chave: 'cpf', ordenavel: false },
          { nome: 'Status', chave: 'status_nome', ordenavel: false },
          { nome: 'Ações', chave: 'acao', ordenavel: false }
      ]"
      :acao="['editar']"
      :atualizacao="atualizarPagina"
      @editar="redirecionarPagina"
      @buscar="buscarAtendidoAceitacao"
    >

      <template #acao="{ linha }">
        <i class="fas fa-file" @click="abrirArquivos(linha as AtendidoAceitacaoInterface)"></i>
      </template>

      <template #filtro>

        <InputSelect
          v-model="status"
          opcaoDefault="Todos"
          :opcoes="statusOptions"
          @select-change="buscarAtendidoAceitacao"
        />

      </template>

    </tabela-schema>

  </section>

  <modal-cadastrar-atendido-aceitacao
    v-if="modalCadastrarAberto"
    @fechar-modal="modalCadastrarAberto = false"
    @buscar="buscarAtendidoAceitacao"
  />

  <modal-pessoa-atendido-aceitacao-arquivos
    v-if="aceitacaoAberta"
    :arquivos="aceitacaoAberta.arquivos"
    @fechar-modal="abrirArquivos"
    @enviar-arquivo="enviarArquivo"
  />


</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_CONTRIBUICOES
})

const router = useRouter();
const atendidoAceitacaoStore = useAtendidoAceitacaoStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const status = ref('')
const modalCadastrarAberto = ref(false)
const aceitacaoAbertaId = ref<number | null>(null)

const aceitacaoAberta = computed(() => {
  if(!aceitacaoAbertaId.value) return null

  return atendidoAceitacaoStore?.getAtendidoAceitacao.items?.find((item) => item.id === aceitacaoAbertaId.value) ?? null
})

const statusOptions = computed(() => atendidoAceitacaoStore?.getStatusParaSelect ?? [])
const aceitacao = computed(() => {
  const a = atendidoAceitacaoStore?.getAtendidoAceitacao ?? {}

  const items = a.items?.map((item) => {
    return {
      ...item,
      nome: item.pessoa.nome,
      cpf: item.pessoa.cpf ? FormatarParaForm.formatarCpf(item.pessoa.cpf) : '-',
      status_nome: item.status.descricao
    }
  })

  return {
    ...a,
    items: items
  }
})

const buscarAtendidoAceitacao = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<SocioControleContribuicaoBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(status.value) paramsLocal.status = status.value

  isLoading.value = true
  await atendidoAceitacaoStore.fetchAtendidoAceitacao(paramsLocal)
  isLoading.value = false
}

const abrirArquivos = (linha: AtendidoAceitacaoInterface | null = null) => {
  aceitacaoAbertaId.value = linha?.id ?? null
}

const enviarArquivo = async (arquivo: File) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  if(!aceitacaoAbertaId.value || !arquivo) return

  try {
    await atendidoAceitacaoStore.fetchAtendidoAceitacaoArquivoCadastrar(formData, aceitacaoAbertaId.value)

    await buscarAtendidoAceitacao()
    alertStore.mostrarAlerta('success', 'Arquivo cadastrado com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao enviar a imagem!')
  }

}

const redirecionarPagina = (linha: AtendidoAceitacaoArquivoInterface) => {
  router.push(`/atendido/aceitacao/${linha.id}`)
}

onMounted(async () => {
  await buscarAtendidoAceitacao()
  if(!atendidoAceitacaoStore.getStatusParaSelect.length) await atendidoAceitacaoStore.fetchAtendidoAceitacaoStatus()

  isLoading.value = false
})

</script>

<style lang="scss">

.tabela-atendido-aceitacao {

  .novo-processo {
    height: 36px;
    margin: 48px;
    width: 128px;
  }


  .fa-file {
    background-color: $color-quinary;
    border-radius: 8px;
    color: $color-white;
    padding: 12px;
  }
}


</style>
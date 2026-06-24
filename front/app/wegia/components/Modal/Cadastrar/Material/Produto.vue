<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Produto</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

    <ModalCadastrarBaseCadastroTexto
      v-if="modalCategoria"
      texto="Cadastrar Categoria"
      placeholder="Nome da categoria"
      @enviar-modal="enviarCategoria"
      @fechar-modal="materialCategoriaStore.setAbrirModal"
    />

    <ModalCadastrarBaseCadastroTexto
      v-if="modalUnidade"
      texto="Cadastrar Unidade"
      placeholder="Nome da unidade"
      @enviar-modal="enviarUnidade"
      @fechar-modal="materialUnidadeStore.setAbrirModal"
    />

  </Modal>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { cadastrarProduto, atualizarProduto, enviarProduto, enviarAtualizacaoProduto } from '~/forms/Material/Produto'

const props = defineProps<{
  produto: MaterialProdutoInterface | null
}>()

const materialCategoriaStore = useMaterialCategoriaStore()
const materialUnidadeStore = useMaterialUnidadeStore()
const alertStore = useAlertStore()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(cadastrarProduto)

const modalCategoria = computed(() => materialCategoriaStore.getModalAberto)
const modalUnidade = computed(() => materialUnidadeStore.getModalAberto);

const enviar = async () => {
  try {
    let data;
    if(props.produto) {
      data = await enviarAtualizacaoProduto(props.produto.id_produto, formulario.value)
    } else {
      data = await enviarProduto(formulario.value)
    }

    if(data?.status == 422) return

    emit('buscar')
    emit('fechar-modal')
    alertStore.mostrarAlerta('success', 'Produto cadastrado com sucesso!')
  } catch(e) {
    console.error('Erro:', e)
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.descricao?.some((msg : string) => msg.includes('único'))) {
      alertStore.mostrarAlerta('error', 'Produto ja existe!')
    }
  }
}

const enviarCategoria = async (descricao: string) => {
  try {
    if(materialCategoriaStore.existeCategoria(descricao)) return  alertStore.mostrarAlerta('error', 'Categoria ja existe!')

    await materialCategoriaStore.fetchCadastrarCategoria({ descricao })

    await materialCategoriaStore.fetchCategoriasParaFiltros()
    materialCategoriaStore.setAbrirModal()
    alertStore.mostrarAlerta('success', 'Categoria cadastrada com sucesso!')
  } catch(e) {
    console.error('Erro:', e)
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar categoria!')
    throw e
  }
}

const enviarUnidade = async (descricao: string) => {
  try {
    if(materialUnidadeStore.existeUnidade(descricao)) return  alertStore.mostrarAlerta('error', 'Unidade ja existe!')

    await materialUnidadeStore.fetchCadastrarUnidade({ descricao })

    await materialUnidadeStore.fetchUnidadesParaFiltros()
    materialUnidadeStore.setAbrirModal()
    alertStore.mostrarAlerta('success', 'Unidade cadastrada com sucesso!')
  } catch(e) {
    console.error('Erro:', e)
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar unidade!')
    throw e
  }
}


onMounted( async () => {
  if(!materialCategoriaStore.getCategoriasParaFiltrosParaSelect.length) materialCategoriaStore.fetchCategoriasParaFiltros()
  if(!materialUnidadeStore.getUnidadesParaFiltrosParaSelect.length) materialUnidadeStore.fetchUnidadesParaFiltros()

  if(props.produto) {
    formulario.value = atualizarProduto
    preencherFormulario(props.produto, [formulario.value])
  }
})


onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>{{ titulo }}</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

  </Modal>

</template>

<script setup lang="ts">

import { cadastrarRegraMeioPagamento, enviarCadastrarRegraMeioPagamento, enviarAtualizarRegraMeioPagamento } from '~/forms/Contribuicao/RegraMeioPagamento'

const props = defineProps<{
  titulo: String,
  meio?: ContribuicaoMeioPagamentoInterface | null
}>()
const emit = defineEmits(['fechar-modal', 'buscar'])

const contribuicaoRegraStore = useContribuicaoRegraStore()
const contribuicaoMeioPagamentoStore = useContribuicaoMeioPagamentoStore()

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(cadastrarRegraMeioPagamento)

const enviar = async () => {
  try {
    let data;

    if(props.meio) {
      data = await enviarAtualizarRegraMeioPagamento(props.meio.id, formulario.value)
    } else {
      data = await enviarCadastrarRegraMeioPagamento(formulario.value)
    }

    if(data?.status == 422) return

    emit('buscar')
    emit('fechar-modal')
  } catch(e) {
    console.error('Erro:', e)
  }
}

onMounted( async () => {
  if(props.meio) preencherFormulario(props.meio, [formulario.value])
  if( contribuicaoMeioPagamentoStore.getMeiosFiltros.length == 0 ) await contribuicaoMeioPagamentoStore.fetchMeiosFiltro()
  if( contribuicaoRegraStore.getRegrasFiltro.length == 0 ) await contribuicaoRegraStore.fetchRegrasFiltro()

})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
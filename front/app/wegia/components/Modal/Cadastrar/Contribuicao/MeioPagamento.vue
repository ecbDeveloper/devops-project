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

import { cadastrarMeioPagamento, enviarAtualizarMeioPagamento } from '~/forms/Contribuicao/MeioPagamento'

const props = defineProps<{
  titulo: String,
  meio?: ContribuicaoMeioPagamentoInterface | null
}>()
const emit = defineEmits(['fechar-modal', 'buscar'])

const contribuicaoGatewayStore = useContribuicaoGatewayStore()

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(cadastrarMeioPagamento)

const enviar = async () => {
  try {
    if(!props.meio) return

    const data = await enviarAtualizarMeioPagamento(props.meio.id, formulario.value)

    if(data?.status == 422) return

    emit('buscar')
    emit('fechar-modal')
  } catch(e) {
    console.error('Erro:', e)
  }
}

onMounted( async () => {
  if(props.meio) preencherFormulario(props.meio, [formulario.value])
  if(!contribuicaoGatewayStore.getGatewaysFiltros.length) await contribuicaoGatewayStore.fetchGatewaysFiltro()
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
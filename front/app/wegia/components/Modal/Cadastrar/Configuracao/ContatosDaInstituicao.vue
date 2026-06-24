<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>Contato da instituição </p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

  </Modal>

</template>

<script setup lang="ts">

import { ContatoDaInstituicao, enviarContato, atualizarContato } from '~/forms/Configuracao/ContatoDaInstituicao'

const props = defineProps<{
  contato: ConfiguracaoContatoInstituicaoInterface | null
}>()
const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(ContatoDaInstituicao)

const enviar = async () => {
  try {
    if(props.contato) {
      await atualizarContato(props.contato.id, formulario.value)
    } else {
      await enviarContato(formulario.value)
    }

    emit('buscar')
    emit('fechar-modal')
  } catch(e) {
    console.error('Erro:', e)
  }
}

onMounted( async () => {

  if(props.contato) preencherFormulario(props.contato, [formulario.value])

})

onUnmounted(() => {
  limparCampos([formulario.value])
})


</script>
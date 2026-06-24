<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Intercorrencia</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

  </Modal>

</template>

<script setup lang="ts">

import { cadastrarIntercorrencia, enviarIntercorrencia } from '@/forms/Saude/CadastrarIntercorrencia'

const props = defineProps<{
  id_fichamedica: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref(cadastrarIntercorrencia)

const enviar = async () => {
  try {
    const data = await enviarIntercorrencia(props.id_fichamedica, formulario.value)

    if(data?.status == 200){
      emit('buscar')
      emit('fechar-modal')
    }
  } catch(e) {
    console.error('Erro:', e)
    throw e
  }
}

</script>
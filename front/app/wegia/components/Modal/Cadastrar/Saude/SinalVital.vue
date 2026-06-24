<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Novo Sinal Vital</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

  </Modal>

</template>

<script setup lang="ts">

import { cadastrarSinalVital, enviarSinalVital } from '@/forms/Saude/CadastrarSinalVital'

const props = defineProps<{
  id_fichamedica: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref(cadastrarSinalVital)

const enviar = async () => {
  try {
    const data = await enviarSinalVital(props.id_fichamedica, formulario.value)

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
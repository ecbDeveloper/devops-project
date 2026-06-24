<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Nova CID</p>
      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />
  </Modal>
</template>

<script setup lang="ts">

import { cadastrarCID, enviaCID } from '@/forms/Saude/CadastrarCID'

const saudeCidStore = useSaudeCIDStore()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref(cadastrarCID)

const enviar = async () => {
  try {
    const data = await enviaCID(formulario.value,)

    if(data?.status == 200){
      emit('buscar')
      emit('fechar-modal')
    }
  } catch(e) {
    console.error('Erro:', e)
    throw e
  }
}

onMounted(async () => {
  if(!saudeCidStore.getCidsParaSelect?.length) await saudeCidStore.fetchCids()
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
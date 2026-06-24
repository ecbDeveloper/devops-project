<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>Cadastrar Nova Aplicação</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />
  </Modal>
</template>

<script setup lang="ts">

import { cadastrarMedicamentoAdministracao, enviarMedicamentoAdministracao } from '@/forms/Saude/CadastrarMedicamentoAdministracao'

const props = defineProps<{
  id_medicacao: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref(cadastrarMedicamentoAdministracao)

const enviar = async () => {
  try {
    await enviarMedicamentoAdministracao(props.id_medicacao, formulario.value)
    emit('buscar')
    emit('fechar-modal')
  } catch (e) {
    throw e;
  }
}

</script>
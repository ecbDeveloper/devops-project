<template>
  <div class="form-container">

    <div class="formularios">
      <Forms
        :bloqueado="bloqueado"
        :formulario="formulario"
        @enviarFormulario="enviar"
      >
        <template #botao v-if="medicamento">
          <Butao class="botao" :class="botaoEditar" :texto="botaoEditar" @click-botao="toggleEditar" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MEDICAMENTO)" />
        </template>
      </Forms>

    </div>

  </div>
</template>

<script setup lang="ts">

import { cadastrarMedicamentoPet, enviarMedicamento, atualizarMedicamento } from '@/forms/pet/cadastrarMedicamentoPet';

const props = defineProps<{
  medicamento?: PetMedicamentoInterface | null
}>()

const pessoaStore = usePessoaStore()

const formulario = reactive(cadastrarMedicamentoPet)

const bloqueado = ref(false)
const botaoEditar = ref('editar')

const toggleEditar = () => {
    bloqueado.value = !bloqueado.value
    botaoEditar.value = botaoEditar.value === 'editar' ? 'cancelar' : 'editar'
}

const enviar = async () => {
    if(props.medicamento) {
      bloqueado.value = true
      atualizarMedicamento(props.medicamento.id_medicamento, formulario)
    } else {
      enviarMedicamento(formulario)
    }
}

onMounted(() => {
  console.log(props.medicamento)
    if(props.medicamento) {
        bloqueado.value = true
        preencherFormulario(props.medicamento, [formulario])
    }
})

onUnmounted(() => {
  limparCampos([formulario])
})

</script>


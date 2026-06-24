<template>
        <div class="form-ficha-medica-container">
            <Forms
              :bloqueado="bloqueado"
              :formulario="formulario"
              @enviarFormulario="enviar"
            >
              <template #botao v-if="ficha">
                  <Butao class="botao" :class="botaoEditar" :texto="botaoEditar" @click-botao="toggleEditar" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PET)" />
              </template>
            </Forms>

      </div>
</template>

<script setup lang="ts">

import { cadastrarFichaPet, atualizarFichaMedica, enviarFichaMedica } from '~/forms/pet/cadastrarFichaPet';

const props = defineProps<{
    ficha?: FichaMedicaInterface | null
    id: number
}>()

const emit = defineEmits(['atualizar-infos'])

const pessoaStore = usePessoaStore()

const formulario = reactive(cadastrarFichaPet)

const bloqueado = ref(false)
const botaoEditar = ref('editar')

const toggleEditar = () => {
    bloqueado.value = !bloqueado.value
    botaoEditar.value = botaoEditar.value === 'editar' ? 'cancelar' : 'editar'
}

const enviar = async () => {
    if(props.ficha) bloqueado.value = true

    try {
      if(props.ficha) {
        await atualizarFichaMedica(formulario, props.id)
      } else {
        await enviarFichaMedica(formulario, props.id)
      }
      emit('atualizar-infos')
    } catch (e) {
      throw e
    }

}

onMounted(() => {
    if(props.ficha) {
        bloqueado.value = true
        preencherFormulario(props.ficha, [formulario])
    }
})
</script>

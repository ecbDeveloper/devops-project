<template>
  <div class="form-ficha-medica-container">
      <Forms
        :bloqueado="bloqueado"
        :formulario="formulario"
        @enviarFormulario="enviar"
      >
        <template #botao v-if="adotante">
            <Butao class="botao" :class="botaoEditar" :texto="botaoEditar" @click-botao="toggleEditar" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PET_ADOCAO)" />
        </template>
      </Forms>
  </div>
</template>

<script setup lang="ts">

import { cadastrarAdotante, atualizarAdotante, enviarCadastroAdotante } from '~/forms/pet/cadastrarAdotante';

const props = defineProps<{
  adotante?: AdotanteInterface | null
  id: number
}>()

const emit = defineEmits(['atualizar-infos'])

const pessoaStore = usePessoaStore()

const formulario = reactive(cadastrarAdotante)

const bloqueado = ref(false)
const botaoEditar = ref('editar')

const toggleEditar = () => {
  bloqueado.value = !bloqueado.value
  botaoEditar.value = botaoEditar.value === 'editar' ? 'cancelar' : 'editar'
}

const enviar = async () => {
  if(props.adotante) bloqueado.value = true

  try {
    const data: any = {}
    if(props.adotante) {
      await atualizarAdotante(formulario, props.adotante.id_adocao)
    } else {
      await enviarCadastroAdotante(formulario, props.id)
    }

    emit('atualizar-infos')
  } catch (e) {
    throw e
  }
}

onMounted(async () => {
  if(props.adotante) {
    bloqueado.value = true
    preencherFormulario(props.adotante, [formulario])
  } else {
    bloqueado.value = !pessoaStore.possuiPermissao(Permissao.CRIAR_PET_ADOCAO)
  }
})
</script>
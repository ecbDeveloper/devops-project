<template>
   <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_FICHA_MEDICA)">Você não possui permissão!</h2>
  <div class="saude-cadastrar-ficha-medica" v-else>

    <Forms
      v-if="!isLoading"
      :formulario="formulario"
      @enviarFormulario="cadastrar"
    />

    <Loading v-else />
  </div>

</template>

<script setup lang="ts">

import { cadastrarFichaMedica, enviarFichaMedica } from '~/forms/Saude/CadastrarFichaMedica';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_FICHA_MEDICA
})

const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()

menuSectionStore.setTitulo("Cadastrar Ficha médica")
menuSectionStore.setComplemento("Cadastre a ficha médica do paciente")

const formulario = ref(cadastrarFichaMedica)
const isLoading = ref(true)

const cadastrar = async () => {
    await enviarFichaMedica(formulario.value)
}

onMounted(async () => {
  isLoading.value = true
  await pessoaStore.fetchParaFiltro()
  isLoading.value = false
})


</script>

<style scoped lang="scss">

.saude-cadastrar-ficha-medica {
    padding: 12px;

    @include lg {
        padding: 24px;
    }

}

</style>
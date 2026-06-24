<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_MEMORANDO)">Você não possui permissão!</h2>
  <div class="memorando-cadastrar" v-else>
    <Forms
      v-if="!loading"
      :formulario="formulario"
      @enviarFormulario="enviarForm"
    />

    <Loading v-else />
  </div>
</template>

<script setup lang="ts">

import { cadastrarMemorando, enviarCadastarMemorando } from '@/forms/Memorando/CadastrarMemorando'
import { limparCampos } from '@/utils/FormDataTransform'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_MEMORANDO
})

const funcionarioStore = useFuncionarioStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const loading = ref(true)
const formulario = ref(cadastrarMemorando)

const params = {
  permissao: Permissao.CRIAR_DESPACHO
}

const fetchFuncionarios = async () => {
  loading.value = true
  try {
    await funcionarioStore.fetchTodosFuncionarios(params)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const enviarForm = async () => {
  try {
    const data = await enviarCadastarMemorando(formulario.value)

    if(data && data.status == 422) return alertStore.mostrarAlerta('error', 'Verifique os campos enviados!')
    alertStore.mostrarAlerta('success', 'Memorando cadastrado com sucesso!')
    limparCampos([formulario.value])
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar memorando')
  }
}

fetchFuncionarios()

</script>

<style scoped lang="scss">

.memorando-cadastrar {
  padding: 12px;

  @include lg {
    padding: 48px;
  }
}

</style>
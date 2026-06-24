<template>
    <FormsEditarBlock
        :formulario="formulario"
        :permissaoEditar="permissaoEditar"
        @enviarFormulario="enviarFormulario"
    />
</template>

<script setup lang="ts">

import { enviarInformacoesPessoais, informacoesPessoais } from '~/forms/Funcionario/informacoes_pessoais';

const props = defineProps({
    id_funcionario: Number,
    permissaoEditar: Boolean
})

const funcionarioStore = useFuncionarioStore()

const funcionario = computed(() => funcionarioStore.getFuncionario)

const formulario = reactive(informacoesPessoais)

const enviarFormulario = () => {
    enviarInformacoesPessoais(formulario, funcionario.value.pessoa.id_pessoa)
}

onMounted(async () => {
    const funcionarioLocal = funcionarioStore.getFuncionario
    if((!funcionarioLocal || funcionarioLocal.id_funcionario !== props.id_funcionario) && props.id_funcionario) {
        limparCampos(formulario)
        await funcionarioStore.fetchFuncionario(props.id_funcionario)
    }

    preencherFormulario(funcionarioStore.getFuncionario.pessoa, formulario)

})
</script>
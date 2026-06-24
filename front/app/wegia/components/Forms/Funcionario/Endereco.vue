<template>
    <FormsEditarBlock
        :formulario="formulario"
        :permissaoEditar="permissaoEditar"
        @enviarFormulario="enviarFormulario"
    />
</template>

<script setup lang="ts">

import { endereco, enviarEndereco } from '~/forms/Funcionario/Endereco';

const funcionarioStore = useFuncionarioStore()
const cepStore = useCepStore()

const props = defineProps({
    id_funcionario: Number,
    permissaoEditar: Boolean
})

const funcionario = computed(() => funcionarioStore.getFuncionario)

const formulario = reactive(endereco)

const enviarFormulario = () => {
    enviarEndereco(formulario, funcionario.value.pessoa.id_pessoa)
}

watch(
  () => cepStore.endereco, (newValue, oldValue) => {
        if(!newValue.erro) {
            preecherFormularioComCep(newValue, formulario)
        }
  }
)

onMounted(async () => {
    const funcionarioLocal = funcionarioStore.getFuncionario
    if((!funcionarioLocal || funcionarioLocal.id_funcionario !== props.id_funcionario) && props.id_funcionario) {
        await funcionarioStore.fetchFuncionario(props.id_funcionario)
    }

    preencherFormulario(funcionarioStore.getFuncionario.pessoa, formulario)

})

</script>
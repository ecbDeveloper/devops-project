<template>
    <FormsEditarBlock
        :formulario="formulario"
        @enviarFormulario="enviarFormulario"
    />
</template>

<script setup lang="ts">

import { enviarInformacoesPessoais, informacoesPessoais } from '~/forms/Funcionario/informacoes_pessoais';
import type {PessoaInterface} from '~/interface/Pessoa/PessoaInterface';

const props = defineProps<{
    pessoa: PessoaInterface
}>()

const formulario = reactive(informacoesPessoais)

const enviarFormulario = () => {
    enviarInformacoesPessoais(formulario, props.pessoa.id_pessoa)
}

onMounted(async () => {
    limparCampos(formulario)
    preencherFormulario(props.pessoa, formulario)
})
</script>
<template>
    <FormsEditarBlock
        :formulario="formulario"
        @enviarFormulario="enviarFormulario"
    />
</template>

<script setup lang="ts">

import { documentacao, enviarDocumentacao } from '~/forms/Funcionario/documentacao';
import type { PessoaInterface } from '~/interface/Pessoa/PessoaInterface';

const props = defineProps<{
    pessoa: PessoaInterface
}>()

const formulario = reactive(documentacao)

const enviarFormulario = () => {
    enviarDocumentacao(formulario, props.pessoa.id_pessoa)
}

onMounted(async () => {
    limparCampos(formulario)
    preencherFormulario(props.pessoa, formulario)
})

</script>
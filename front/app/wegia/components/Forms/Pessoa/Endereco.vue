<template>
    <FormsEditarBlock
        :formulario="formulario"
        @enviarFormulario="enviarFormulario"
    />
</template>

<script setup lang="ts">

import { endereco, enviarEndereco } from '~/forms/Funcionario/Endereco';
import type { PessoaInterface } from '~/interface/Pessoa/PessoaInterface';

const props = defineProps<{
    pessoa: PessoaInterface
}>()

const cepStore = useCepStore()

const formulario = reactive(endereco)

const enviarFormulario = () => {
    enviarEndereco(formulario, props.pessoa.id_pessoa)
}

onMounted(async () => {
    limparCampos(formulario)
    preencherFormulario(props.pessoa, formulario)
})

watch(
  () => cepStore.endereco, (newValue, oldValue) => {
        if(!newValue.erro) {
            preecherFormularioComCep(newValue, formulario)
        }
  }
)

</script>
<template>

<SectionSimplesForm :textoBotao=textoBotao :titulo=titulo @enviar-formulario="enviar" class="forms-varias-sessoes">
    <section v-for="(form, index1) in formulario" :key="index1">
        <h2>{{ form.titulo }}</h2>
        <Input
            v-for="(item, index2) in form.itens"
            :key="index2"
            :placeholder=item.placeholder
            :mask=item.mask
            :regex="item.regex"
            :erro="item.erro"
            :type="item.type"
            :label="item.label"
            :opcoes="item.opcoes"
            :storeOpcoes="item.storeOpcoes"
            :desabilitado="item.desabilitado"
            :obrigatorio="item.obrigatorio"
            :blur="item.blur"
            v-model="item.value"
        />
    </section>
    <template #botao>
        <slot name="botao" />
    </template>
</SectionSimplesForm>

</template>

<script setup lang="ts">

import type { FormularioInterface } from '~/interface/Formulario/FormularioInterface';

defineProps({
    formulario: {
        type: Array<{titulo: string, itens: FormularioInterface[]}>,
        required: true
    },
    titulo: String,
    textoBotao: {
        type: String,
        default: 'Enviar'
    }
})

const emit = defineEmits(['enviarFormulario']);

const enviar = () => {
    emit('enviarFormulario')
}

</script>

<style scoped lang="scss">

.forms-varias-sessoes {

    section {
        border-top: 1px dotted $color-secondary;
        padding-top: 24px;

        &:first-child {
            border-top: none;
            padding: 0px;
        }

        h2 {
            color: $color-octonary;
            font-weight: 500;
            margin-bottom: 16px;
        }
    }

}

</style>
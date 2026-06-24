<template>

<SectionSimplesForm
    :titulo=titulo
    :bloqueado="bloqueado"
    textoBotao="Salvar"
    class="forms-editar-block"
    @enviar-formulario="enviar"
>
    <section v-for="(form, index1) in formulario" :key="index1">
        <h2>{{ form.titulo }}</h2>
        <slot name="antesFormulario"/>

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
            :obrigatorio="item.obrigatorio"
            :blur="item.blur"
            :bloqueado="bloqueado"
            :max="item.max"
            :desabilitado="item.desabilitado"
            @update:erro="item.erro = $event"
            v-model="item.value"
        />
    </section>
    <template #botao>
        <Butao class="botao" :class="botaoEditar" :texto="botaoEditar" @click-botao="toggleEditar" v-if="permissaoEditar" />
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
    permissaoEditar: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['enviarFormulario']);

const botaoEditar = ref('editar')
const bloqueado = ref(true)

const toggleEditar = () => {
    bloqueado.value = !bloqueado.value
    botaoEditar.value = botaoEditar.value === 'editar' ? 'cancelar' : 'editar'
}

const enviar = () => {
    toggleEditar()
    emit('enviarFormulario')
}

</script>

<style scoped lang="scss">

.forms-editar-block {

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

    .editar {
        background: $color-quinary;
    }

    .cancelar {
        background: $color-error;
    }

}

</style>
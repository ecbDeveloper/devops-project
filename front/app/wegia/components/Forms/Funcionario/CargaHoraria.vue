<template>
    <FormsEditarBlock :formulario="formulario" @enviarFormulario="enviar" :permissaoEditar="pessoaStore.possuiPermissao(Permissao.CRIAR_QUADRO_HORARIO_FUNCIONARIO)">

        <template #antesFormulario>
            <div class="carga-horaria">
                <span>Carga horária diária: {{ cargaHoraria.carga_horaria }}</span>
                <span>Carga horária semanal: {{ cargaHoraria.total }}</span>
            </div>

        </template>

    </FormsEditarBlock>
</template>

<script setup lang="ts">

import { cargaHorariaForm, enviarCargaHoraria } from '~/forms/Funcionario/cargaHoraria';

const props = defineProps({
    id_funcionario: {
        type: Number,
        required: true
    }
})

const cargaHorariaStore = useCargaHorariaStore()
const pessoaStore = usePessoaStore()

const formulario = ref(cargaHorariaForm)

const cargaHoraria = computed(() => cargaHorariaStore.getCargaHoraria)

const enviar = async () => {
    await enviarCargaHoraria(formulario.value, props.id_funcionario)
}

onMounted( async () => {
    limparCampos(formulario.value)
    await cargaHorariaStore.fetchCargaHoraria(props.id_funcionario).then(() => {
        const cargaHorariaLocal = cargaHorariaStore.getCargaHoraria
        const tipoEscala = { tipo: cargaHorariaLocal.tipo.id_tipo, escala: cargaHorariaLocal.escala.id_escala }
        preencherFormulario(cargaHorariaLocal, formulario.value)
        preencherFormulario(tipoEscala, formulario.value)
    })
})

</script>

<style scoped lang="scss">

.carga-horaria {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
}

</style>
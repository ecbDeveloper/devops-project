<template>

<Modal @fechar-modal="fecharModal">

    <BreadCrumbTimeLine
            :steps=etapas
            :currentStep="etapaAtual"
            @navigate="handleStepChange"
        />

        <div class="form-container">

            <div class="formularios">

                <FormsVariasSessoes
                    v-if="etapaAtual == 1"
                    :formulario="primeiroForm"
                    @enviarFormulario="enviarPrimeiroFormulario"
                />

                <FormsVariasSessoes
                    v-if="etapaAtual == 2"
                    :formulario="segundoForm"
                    @enviarFormulario="enviarSegundoFormulario"
                />

                <FormsVariasSessoes
                    v-if="etapaAtual == 3"
                    :formulario="terceiroForm"
                    @enviarFormulario="enviarTerceiroFormulario"
                />
            </div>

        </div>

</Modal>

</template>

<script setup lang="ts">

import { cadastrarDependenteParentesco, cadastrarDependenteCPF, cadastrarDependenteDocumento, enviarDependenteCPF, enviarDependenteDocumento, enviarDependente } from '~/forms/Pessoa/cadastrarDependente';

const props = defineProps({
    id_pessoa: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['fechar-modal'])

const pessoaStore = usePessoaStore()

const etapas = [
    { label: 'Adicionar CPF', icon: 'fa-solid fa-id-card' },
    { label: 'Cadastrar Pessoa', icon: 'fa-solid fa-user-plus' },
    { label: 'Parentesco', icon: 'fas fa-users' },
]
const etapaAtual = ref(1);

const primeiroForm = reactive(cadastrarDependenteCPF)
const segundoForm = reactive(cadastrarDependenteDocumento)
const terceiroForm = reactive(cadastrarDependenteParentesco)

const enviarPrimeiroFormulario = async () => {
    const data = await enviarDependenteCPF(primeiroForm)

    if(!data.enviado) return

    desabilitarCampos(segundoForm, false)
    preencherFormulario(data.json, segundoForm)
    if(data.json?.nome) {
        desabilitarCampos(segundoForm)
        etapaAtual.value = 3
        return
    }

    etapaAtual.value++
}

const enviarSegundoFormulario = async () => {
    if(!segundoForm[0].itens[0].desabilitado) {
        const data = await enviarDependenteDocumento(segundoForm)

        if(!data.enviado) return
    }

    return etapaAtual.value++

}

const enviarTerceiroFormulario = async () => {
    const data = await enviarDependente(terceiroForm, pessoaStore.getPessoaPorCpf.id_pessoa, props.id_pessoa)

    if(!data.enviado) return

    fecharModal()
}

const handleStepChange = (index: number) => {
    if(index + 1 <= etapaAtual.value) etapaAtual.value = index + 1
}

const fecharModal = () => {
    limparCampos(primeiroForm)
    limparCampos(segundoForm)
    limparCampos(terceiroForm)
    pessoaStore.setPessoaPorCpf()
    emit('fechar-modal')
}

</script>
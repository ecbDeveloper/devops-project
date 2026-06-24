<template>
    <h2 class="sem-permissao" v-if="!pessoa.possuiPermissao(Permissao.CRIAR_ATENDIDO)">Você não possui permissão!</h2>

    <FormsCadastrar
        v-else
        class="atendido-cadastrar"
        :etapaAtual="etapaAtual"
        :etapas="etapas"
        @stepChange="etapaAtual = $event"
    >

        <FormsVariasSessoes
            v-if="etapaAtual == 1"
            :titulo="titulo"
            :formulario="primeiroForm"
            @enviarFormulario="enviarPrimeiroFormulario"
        >
            <template #botao>
                <butao
                    texto="Sem CPF"
                    @click-botao="enviarSemCPF"
                />
            </template>
        </FormsVariasSessoes>

        <FormsVariasSessoes
            v-if="etapaAtual == 2"
            :titulo="titulo"
            :formulario="segundoForm"
            @enviarFormulario="enviarSegundoFormulario"
        />

        <FormsVariasSessoes
            v-if="etapaAtual == 3"
            :titulo="titulo"
            :formulario="terceiroForm"
            @enviarFormulario="enviarTerceiroFormulario"
        />

    </FormsCadastrar>

</template>

<script setup lang="ts">

import { cadastrarAtendido, enviarCadastroAtendido } from '~/forms/Atendido/Atendido';
import { cadastrarPessoaAtendido, cadastrarPessoaCPF, enviarCadastroPessoa, enviarCadastroPessoaCPF } from '~/forms/Pessoa/cadastrarPessoa';
import type { PessoaInterface } from '~/interface/Pessoa/PessoaInterface';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_ATENDIDO
})

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const pessoa = usePessoaStore()

const id_pessoa = ref<number>(0)

menuSectionStore.setComplemento("Digite seu CPF")

const etapas = [
    { label: 'Adicionar CPF', icon: 'fa-solid fa-id-card' },
    { label: 'Cadastrar Pessoa', icon: 'fa-solid fa-user-plus' },
    { label: 'Atendido', icon: 'fa fa-address-book' },
]
const etapaAtual = ref(1);
const titulo = computed(() => etapas[etapaAtual.value - 1].label)

const primeiroForm = reactive(cadastrarPessoaCPF)
const segundoForm = reactive(cadastrarPessoaAtendido)
const terceiroForm = reactive(cadastrarAtendido)

const enviarPrimeiroFormulario = async () => {
    const data = await enviarCadastroPessoaCPF(primeiroForm) as {status: number, json: PessoaInterface}

    if(
        data.status === 200 &&
        data.json && data.json.id_pessoa
    ) {
        limparCampos(primeiroForm)
        preencherFormulario(data.json, segundoForm)
        desabilitarCampos(segundoForm)
        id_pessoa.value = data.json.id_pessoa
        etapaAtual.value = 3
    }

    if(
        data.status === 404
    ) {
        limparCampos(segundoForm)
        preencherFormulario(data.json, segundoForm)
        etapaAtual.value++
    }
}

const enviarSemCPF = () => {
    mudandoCampoNoFormArray(segundoForm, 'cpf', 'desabilitado', true)
    mudandoCampoNoFormArray(segundoForm, 'cpf', 'obrigatorio', false)
    etapaAtual.value++
}

const enviarSegundoFormulario = async () => {
    if(segundoForm[0].itens[0].desabilitado) {
        return etapaAtual.value++
    }

    const data = await enviarCadastroPessoa(segundoForm)

    if(data.status === 200) {
        id_pessoa.value = pessoa.getPessoaCadastrada.id_pessoa
        desabilitarCampos(segundoForm)
        etapaAtual.value++
    }
}

const enviarTerceiroFormulario = async () => {
    const data = await enviarCadastroAtendido(terceiroForm, id_pessoa.value)

    if(data.status === 200) {
        limparCampos(primeiroForm)
        limparCampos(segundoForm)
        limparCampos(terceiroForm)
        router.push('/atendido')
    }
}

</script>

<style scoped lang="scss">

.atendido-cadastrar {
    padding: 12px;
}

</style>
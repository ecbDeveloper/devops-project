<template>
        <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_FUNCIONARIO)">Você não possui permissão!</h2>
        <div class="cadastrar-funcionario" v-else>
            <BreadCrumbTimeLine
                :steps=etapas
                :currentStep="etapaAtual"
                @navigate="handleStepChange"
            />

            <div class="form-container">

                <InputFileComVisualizacao
                    v-model="imagemForm.value"
                    :erro="imagemForm.erro"
                    :mimeType="imagemForm.mimeType"
                    v-if="etapaAtual == 2"
                />

                <div class="formularios">

                    <FormsVariasSessoes
                        v-if="etapaAtual == 1"
                        :titulo="titulo"
                        :formulario="primeiroForm"
                        @enviarFormulario="enviarPrimeiroFormulario"
                    />

                    <FormsVariasSessoes
                        v-if="etapaAtual == 2"
                        :titulo="titulo"
                        :formulario="segundoForm"
                        @enviarFormulario="enviarSegundoFormulario"
                    />
                </div>

            </div>

            <ModalCadastrarSituacao v-if="modalSituacaoAberto" />
            <ModalCadastrarFuncionarioPerfil
                v-if="modalPerfil"
                @fechar-modal="perfilStore.toggleModalNovoPerfil"
            />
        </div>
</template>

<script setup lang="ts">

import { cadastrarFuncionario, cadastrarFuncionarioCpf, enviarCadastroFuncionario, enviarCadastroFuncionarioCPF } from '~/forms/Funcionario/cadastrarFuncionario';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_FUNCIONARIO
})

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const situacaoStore = useSituacaoStore()
const perfilStore = usePerfilStore()
const pessoaStore = usePessoaStore()

menuSectionStore.setTitulo("Cadastrar")
menuSectionStore.setComplemento("Digite seu CPF")

const modalSituacaoAberto = computed(() => situacaoStore.getModalAberto)
const modalPerfil = computed(() => perfilStore.getModalNovoPerfil)

const etapas = [
    { label: 'Adicionar CPF', icon: 'fa-solid fa-id-card' },
    { label: 'Cadastrar Funcionario', icon: 'fa-solid fa-user-plus' }
]
const etapaAtual = ref(1);
const titulo = computed(() => etapas[etapaAtual.value - 1].label)

const primeiroForm = reactive(cadastrarFuncionarioCpf)
const segundoForm = reactive(cadastrarFuncionario)
const imagemForm = reactive({ value: null, erro: '', mimeType: 'png|jpg|jpeg'})

const enviarPrimeiroFormulario = async () => {
    const data = await enviarCadastroFuncionarioCPF(primeiroForm)

    if(
        data.status === 200 ||
        data.status === 404
    ) {
        limparCampos(segundoForm)
        preencherFormulario(data.json, segundoForm)
        etapaAtual.value++
    }
}

const enviarSegundoFormulario = async () => {
    const data = await enviarCadastroFuncionario(segundoForm, imagemForm)

    if(data.status === 200) {
        limparCampos(primeiroForm)
        limparCampos(segundoForm)
        imagemForm.value = null
        router.push('/')
    }
}

const handleStepChange = (index: number) => {
    if(index + 1 <= etapaAtual.value) etapaAtual.value = index + 1
}

</script>

<style scoped lang="scss">

.cadastrar-funcionario {
    padding: 8px;

    .form-container {
        display: flex;
        gap: 24px;
        flex-direction: column;

        @include md {
            flex-direction: row;
            padding: 48px;
        }

        .input-file-com-visualizacao {
            width: 100%;

            @include md {
                width: 250px;
            }
        }

        .formularios {
            width: 100%;
        }
    }

}

</style>
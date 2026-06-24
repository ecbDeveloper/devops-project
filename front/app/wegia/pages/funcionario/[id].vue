<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_FUNCIONARIO)">Você não possui permissão!</h2>
    <div class="funcionario-id" v-else>
        <aside>
            <InputFileComVisualizacao v-model="imagemForm.value" :mimeType="imagemForm.mimeType" :erro="imagemForm.erro" :semPermissao="!pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PESSOA)" >
                <template #embaixoImagem>
                    <Butao texto="Atualizar" class="botao-atualizar-imagem" @click-botao="salvarImagem" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PESSOA)"/>
                </template>
            </InputFileComVisualizacao>

            <Butao v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_SENHA_DE_OUTRAS_PESSOAS) && funcionario?.pessoa?.adm_configurado !== 1" texto="Alterar senha" @click-botao="toggleModal" />
        </aside>

        <div class="formularios">
            <Loading v-if="isLoading" class="loading" />
            <Abas v-model="abaSelecionada" :tabs="abas" v-else >
                <template #informacoes-pessoais>
                    <FormsFuncionarioInformacoesPessoais :id_funcionario="id_funcionario" :permissaoEditar=pessoaStore.possuiPermissao(Permissao.ATUALIZAR_FUNCIONARIO) />
                </template>

                <template #endereco>
                    <FormsFuncionarioEndereco :id_funcionario="id_funcionario" :permissaoEditar=pessoaStore.possuiPermissao(Permissao.ATUALIZAR_FUNCIONARIO) />
                </template>

                <template #documentacao>
                    <FormsFuncionarioDocumentacao :id_funcionario="id_funcionario" :permissaoEditar=pessoaStore.possuiPermissao(Permissao.ATUALIZAR_FUNCIONARIO) />
                </template>

                <template #arquivos>
                    <TabelaPessoaArquivo
                        v-if="funcionario.id_pessoa"
                        :id_pessoa="funcionario.id_pessoa"
                    />
                </template>

                <template #outros>
                    <div class="outros">
                        <FormsFuncionarioOutrosDocumentos :id_funcionario="id_funcionario" />

                        <TabelaFuncionarioOutrosDocumentos :id_funcionario="id_funcionario" v-if="pessoaStore.possuiPermissao(Permissao.VISUALIZAR_OUTRAS_INFORMACOES_FUNCIONARIO)" />
                    </div>
                </template>
                <!-- <template #5>
                    <div class="remuneracao">
                        <h2>Remuneração</h2>

                        <p>Remuneração: R$ {{ remuneracaoTotal }}</p>

                        <TabelaFuncionarioRemuneracao :id_funcionario="id_funcionario" />
                    </div>
                </template> -->
                <template #carga-horaria>
                    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_QUADRO_HORARIO_FUNCIONARIO)">Você não possui permissão de visualizar!</h2>

                    <FormsFuncionarioCargaHoraria :id_funcionario="id_funcionario" v-else />
                </template>

                <template #dependentes>
                    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_DEPENDENTE_FUNCIONARIO)">Você não possui permissão de visualizar!</h2>

                    <TabelaPessoaDependente v-if="funcionario.pessoa" :pessoa="funcionario.pessoa" />
                </template>
            </Abas>
        </div>
    </div>

    <ModalAtualizarPessoaSenha titulo="Nova senha do funcionario" v-if="mostrarModal" @fechar-modal="toggleModal" @enviar-modal="trocarSenha" />
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_FUNCIONARIO
})

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const funcionarioStore = useFuncionarioStore()
const pessoaStore = usePessoaStore()
const documentoStore = useDocumentoStore()
const outrasInfosStore = useOutrasInfosStore()
// const remuneracaoStore = useRemuneracaoStore()
const alertStore = useAlertStore()

const id_funcionario: number = Number(router.currentRoute.value.params.id);

menuSectionStore.setTitulo("Perfil")
menuSectionStore.setComplemento("Página / Perfil")

const funcionario = computed(() => funcionarioStore.getFuncionario)

// const remuneracaoTotal = computed(() => remuneracaoStore.getRemuneracaoTotal)

const abas = ref([
    'Informações Pessoais', 'Endereço', 'Documentação',
    'Arquivos', 'Outros',
    'Carga Horária', 'Dependentes'
])
const abaSelecionada = ref<string>('informacoes-pessoais')
const imagemForm = ref<
    { value: string | File | null, erro: string, mimeType: string }
>({
    value: null,
    erro: '',
    mimeType: 'png|jpg|jpeg'
})
const isLoading = ref(true)
const mostrarModal = ref(false)

const salvarImagem = async () => {
    imagemForm.value.erro = ValidateForm.arquivoValidacao(imagemForm.value.value, imagemForm.value.mimeType, true)

    if(imagemForm.value.erro != "" || imagemForm.value.value == null) return

    const formData = new FormData()
    formData.append('imagem', imagemForm.value.value)

    await pessoaStore.fetchAtualizarImagemPessoa(formData, funcionarioStore.getFuncionario.pessoa.id_pessoa).then(() => {
        alertStore.mostrarAlerta('success', 'Foto de perfil atualizada com sucesso')
    }).catch(() => {
        alertStore.mostrarAlerta('error', 'Erro ao atualizar a foto de perfil')
    })
}

const trocarSenha = async (body: PessoaAtualizarSenhaInterface) => {

    const funcionario = funcionarioStore.getFuncionario

    try {
        await pessoaStore.fetchAtualizarSenhaDeOutraPessoa(funcionario.pessoa.id_pessoa, body)
        toggleModal()
        alertStore.mostrarAlerta('success', 'Senha do funcionario atualizada com sucesso!')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao atualizar a senha do usuario')
    }
}

const toggleModal = () => {
    mostrarModal.value = !mostrarModal.value
}

onMounted(async () => {
    const id: number = Number(router.currentRoute.value.params.id);
    await funcionarioStore.fetchFuncionario(id)
    // await remuneracaoStore.fetchBuscarRemuneracaoTotal(id)
    outrasInfosStore.fetchOutrasInfos({}, id)
    const pessoaLocal = funcionarioStore.getFuncionario.pessoa
    imagemForm.value.value = pessoaLocal.imagem
    isLoading.value = false
})

</script>

<style scoped lang="scss">

.funcionario-id {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 24px;

    @include xxl {
        flex-direction: row;
        padding: 48px;
    }

    aside {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .input-file-com-visualizacao {
            height: auto;
            width: 100%;
            @include xxl {
                width: 250px;
            }
        }

    }


    .botao-atualizar-imagem {
        background-color: $color-octonary;
        transition: 0.5s;

        &:hover {
            background-color: $color-tenth;
            color: $color-black;
        }
    }

    .formularios {
        width: 100%;

        .loading {
            height: 100%;
        }

        .outros,
        .remuneracao {
            background-color: $color-white;
            border-bottom-right-radius: 24px;
            border-bottom-left-radius: 24px;
        }

        .remuneracao {
            h2 {
                color: $color-octonary;
                font-weight: 500;
                margin-bottom: 16px;
                padding-left: 16px;
                padding-top: 16px;
            }

            p {
                padding-left: 16px;
            }
        }
    }
}

</style>
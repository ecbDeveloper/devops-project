<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ATENDIDO)">Você não possui permissão!</h2>
    <div class="atendido-id" v-else>
        <div class="form-esquerdo">
            <InputFileComVisualizacao v-model="imagemForm.value" :mimeType="imagemForm.mimeType" :erro="imagemForm.erro" :semPermissao="!pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PESSOA)" >
                <template #embaixoImagem>
                    <Butao texto="Atualizar" class="botao-atualizar-imagem" @click-botao="salvarImagem" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PESSOA)" />
                </template>
            </InputFileComVisualizacao>

            <Butao :texto="atendido?.atendido_status_idatendido_status === 1 ? 'Desativar' : 'Ativar'" class="botao-atualizar-status" @click-botao="atualizarStatus" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_ATENDIDO)" />
        </div>


        <div class="formularios">
            <Loading v-if="isLoading" class="loading" />
            <Abas :tabs="abas" v-model="abaAberta" v-else >
                <template #informacoes-pessoais>
                    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ATENDIDO)">Você não possui permissão!</h2>

                    <div v-else>
                        <FormsPessoaInformacoesPessoais :pessoa="atendido.pessoa" v-if="atendido.pessoa" />
                    </div>

                </template>

                <template #endereco>
                    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ATENDIDO)">Você não possui permissão!</h2>

                    <div v-else>
                        <FormsPessoaEndereco :pessoa="atendido.pessoa" v-if="atendido.pessoa" />
                    </div>
                </template>

                <template #documentacao>
                    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ATENDIDO)">Você não possui permissão!</h2>

                    <div v-else>
                        <FormsPessoaDocumentacao :pessoa="atendido.pessoa" v-if="atendido.pessoa" />
                    </div>
                </template>

                <template #arquivos>
                    <TabelaPessoaArquivo
                        v-if="atendido?.pessoa?.id_pessoa"
                        :id_pessoa="atendido?.pessoa?.id_pessoa"
                    />
                </template>

                <template #familiares>
                    <TabelaPessoaDependente v-if="atendido.pessoa" :pessoa="atendido.pessoa"/>
                </template>

                <template #ocorrencias>
                    <TabelaAtendidoOcorrencia :atendido="atendido"  />
                </template>
            </Abas>
        </div>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_ATENDIDO
})

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const atendidoStore = useAtendidoStore()

const id_atendido: number = Number(router.currentRoute.value.params.id);
const atendido = computed(() => atendidoStore.getAtendido)


menuSectionStore.setTitulo("Atendido")
menuSectionStore.setComplemento("Páginas / Atendido")

const abas = ref([
    'Informações Pessoais', 'Endereço', 'Documentação',
    'Arquivos', 'Familiares', 'Ocorrências'
])
const abaAberta = ref('informacoes-pessoais')

const imagemForm = ref<{
    value: null | File | string,
    erro: string,
    mimeType: string
}>({
    value: null,
    erro: '',
    mimeType: 'png|jpg|jpeg'
})

const isLoading = ref(true)

const salvarImagem = async () => {
    const file = imagemForm.value.value
    if (!file || !(file instanceof File)) return

    imagemForm.value.erro = ValidateForm.arquivoValidacao(file, imagemForm.value.mimeType, true)

    if(imagemForm.value.erro != "" || file == null) return

    const formData = new FormData()
    formData.append('imagem', file)

    if(!atendido.value.pessoa) return

    await pessoaStore.fetchAtualizarImagemPessoa(formData, atendido.value.pessoa.id_pessoa).then(() => {
        alertStore.mostrarAlerta('success', 'Foto de perfil atualizada com sucesso')
    }).catch(() => {
        alertStore.mostrarAlerta('success', 'Erro ao atualizar a foto de perfil')
    })
}

const atualizarStatus = async () => {
    const body = {
        atendido_status_idatendido_status: atendido.value.atendido_status_idatendido_status === 1 ? 2 : 1
    }

    try {
        await atendidoStore.fetchAtualizarAtendido(id_atendido, body)
        alertStore.mostrarAlerta('success', 'Atendido atualizado com sucesso')
        await atendidoStore.fetchBuscarAtendidoId(id_atendido, 'pessoa,atendidoStatus')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao atualizar o atendido')
    }

}

onMounted(async () => {
    const id: number = Number(router.currentRoute.value.params.id);

    await atendidoStore.fetchBuscarAtendidoId(id, 'pessoa,atendidoStatus')

    const pessoaLocal = atendidoStore.getAtendido.pessoa
    if(pessoaLocal) {
        imagemForm.value.value = pessoaLocal.imagem
    }
    isLoading.value = false
})

</script>

<style scoped lang="scss">

.atendido-id {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 12px;

    @include xl {
        flex-direction: row;
        padding: 48px;
    }

    .form-esquerdo {
        .input-file-com-visualizacao {
            height: auto;
            width: 100%;

            @include xl {
                width: 250px;
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

        .botao-atualizar-status {
            background-color: $color-primary;
            margin-top: 16px;
            transition: 0.5s;

            &:hover {
                background-color: $color-primary-opacity;
            }
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
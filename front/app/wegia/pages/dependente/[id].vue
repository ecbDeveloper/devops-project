<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_DEPENDENTE)">Você não possui permissão!</h2>
  <div class="atendido-id" v-else>
      <InputFileComVisualizacao v-model="imagemForm.value" :mimeType="imagemForm.mimeType" :erro="imagemForm.erro" :semPermissao="!pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PESSOA)" >
          <template #embaixoImagem>
              <Butao texto="Atualizar" class="botao-atualizar-imagem" @click-botao="salvarImagem" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PESSOA)" />
          </template>
      </InputFileComVisualizacao>

      <div class="formularios">
          <Loading v-if="isLoading" class="loading" />
          <Abas :tabs="abas" v-model="abaAberta" v-else >
              <template #informacoes-pessoais>
                  <div>
                      <FormsPessoaInformacoesPessoais :pessoa="dependente.dependente" v-if="dependente.dependente" />
                  </div>

              </template>

              <template #endereco>
                  <div>
                      <FormsPessoaEndereco :pessoa="dependente.dependente" v-if="dependente.dependente" />
                  </div>
              </template>

              <template #documentacao>
                  <div>
                      <FormsPessoaDocumentacao :pessoa="dependente.dependente" v-if="dependente.dependente" />
                  </div>
              </template>

              <template #arquivos>
                  <TabelaPessoaArquivo
                      v-if="dependente?.dependente?.id_pessoa"
                      :id_pessoa="dependente?.dependente?.id_pessoa"
                  />
              </template>

          </Abas>
      </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
middleware: ['permissao'],
permission: Permissao.VISUALIZAR_DEPENDENTE
})

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()
const dependenteStore = useDependenteStore()
const alertStore = useAlertStore()

const dependente = computed(() => dependenteStore.getDependente)

menuSectionStore.setTitulo("Dependente")
menuSectionStore.setComplemento("Páginas / Dependente")

const abas = ref([
  'Informações Pessoais', 'Endereço', 'Documentação',
  'Arquivos'
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

const salvarImagem = async () => {
  imagemForm.value.erro = ValidateForm.arquivoValidacao(imagemForm.value.value, imagemForm.value.mimeType, true)

  if(imagemForm.value.erro != "" || imagemForm.value.value == null) return

  const formData = new FormData()
  formData.append('imagem', imagemForm.value.value)

  if(!dependente.value.dependente) return

  await pessoaStore.fetchAtualizarImagemPessoa(formData, dependente.value.dependente.id_pessoa).then(() => {
      alertStore.mostrarAlerta('success', 'Foto de perfil atualizada com sucesso')
  }).catch(() => {
      alertStore.mostrarAlerta('success', 'Erro ao atualizar a foto de perfil')
  })
}

const isLoading = ref(true)

onMounted(async () => {
  const id: number = Number(router.currentRoute.value.params.id);

  const params = { with: 'dependente' }
  await dependenteStore.fetchDependente(id, params)

  const pessoaLocal = dependenteStore.getDependente.dependente
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
  padding: 8px;

  @include lg {
      flex-direction: row;
      padding: 48px;
  }

  .input-file-com-visualizacao {
      width: 100%;
      @include lg {
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
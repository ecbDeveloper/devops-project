<template>
  <Modal @fechar-modal="emit('fechar-modal')">
    <div class="modal-saude-medicamentos-detalhe">
      <h3 class="titulo">{{ medicacao.medicamento }}</h3>

      <div class="info-basica">
        <div>
          <p><strong>Dosagem:</strong> {{ medicacao.dosagem }}</p>
          <p><strong>Horário:</strong> {{ medicacao.horario }}</p>
          <p><strong>Duração:</strong> {{ medicacao.duracao }}</p>
        </div>

        <div class="status">
          <InputSelect
            v-model="status"
            label="Status"
            :opcoes="opcoesStatus"
            :bloqueado="!pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MEDICACAO)"
          />

          <div class="acoes" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MEDICACAO)">
            <button class="btn salvar" @click="salvar">Salvar</button>
          </div>
        </div>
      </div>

      <Butao
        v-if="medicacao.status == 'Tratamento' && pessoaStore.possuiPermissao(Permissao.CRIAR_MEDICAMENTO_ADMINISTRACAO)"
        class="botao-aplicacao"
        texto="Nova aplicação"
        @click-botao="toggleModal"
      />

      <div v-if="pessoaStore.possuiPermissao(Permissao.VISUALIZAR_MEDICAMENTO_ADMINISTRACAO)">
        <Loading v-if="isLoading" />

        <div class="administracoes">
          <tabela-schema
            v-if="linhas.length"
            titulo="Administrações"
            :linhas="linhas"
            :paginacao="administracao"
            :mostrarTextoPaginacao="false"
            :mostrarFiltros="false"
            :atualizacao="atualizacao"
            :cabecalhos="[
              { nome: 'Aplicação', chave: 'aplicacao', ordenavel: false },
              { nome: 'Funcionário', chave: 'nome', ordenavel: false }
            ]"
            @buscar="buscarAdministracao"
          />

          <p v-else class="nenhuma-aplicacao" >Nenhuma aplicação feita até o momento!</p>
        </div>
      </div>
    </div>

    <modal-cadastrar-saude-medicamento-administracao
      v-if="modalAberto"
      :id_medicacao="medicacao.id_medicacao"
      @fechar-modal="toggleModal"
      @buscar="atualizacao++"
    />

  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  medicacao: SaudeMedicacaoInterface
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const saudeMedicacaoStore = useSaudeMedicacaoStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const status = ref(props.medicacao.status)
const opcoesStatus = ref([
  { texto: 'Tratamento', value: 'Tratamento' },
  { texto: 'Concluído', value: 'Concluido' },
  { texto: 'Substituido', value: 'Substituido' },
  { texto: 'Cancelado', value: 'Cancelado' },
])
const modalAberto = ref(false)
const isLoading = ref(false)
const atualizacao = ref(0)

const administracao = computed(() => saudeMedicacaoStore.getAdministracao)
const linhas = computed(() => {
  return saudeMedicacaoStore.getAdministracao?.items?.map(m => ({
    aplicacao: m.aplicacao,
    nome: m.funcionario?.pessoa?.nome
  })) ?? []
})

const toggleModal = () => { modalAberto.value = !modalAberto.value}

const buscarAdministracao =  async (params: Partial<SaudeMedicacaoAdministracaoBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeMedicacaoAdministracaoBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)

  isLoading.value = true
  await saudeMedicacaoStore.fetchAdministracao(props.medicacao.id_medicacao, paramsLocal)
  isLoading.value = false
}

const salvar = async () => {

  if(props.medicacao.status === status.value) return

  try {
    const body = { status: status.value }

    await saudeMedicacaoStore.fetchAtualizar(props.medicacao.id_medicacao, body)
    emit('buscar')
    emit('fechar-modal')
    alertStore.mostrarAlerta('success', 'Medicação atualizada com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao atualizar medicação!')
    throw e
  }

}

onMounted(async() => {
  isLoading.value = true
  await saudeMedicacaoStore.fetchAdministracao(props.medicacao.id_medicacao, {})

  isLoading.value = false
})

</script>

<style scoped lang="scss">
.modal-saude-medicamentos-detalhe {
  height: auto;
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;

  .titulo {
    font-family: $font-secondary;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: $color-primary;
  }

  .info-basica {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 1.5rem;

    @include md {
      flex-direction: row;
    }

    p {
      font-family: $font-primary;
      font-size: 0.95rem;
      margin: 0.3rem 0;
      strong {
        color: $color-primary;
      }
    }
  }

  .status {
    margin-bottom: 1.5rem;
    width: 100%;

    @include md {
      width: auto;
    }
  }

  .acoes {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-family: $font-secondary;
      font-weight: 500;
      cursor: pointer;
      border: none;

      &.salvar {
        background: $color-primary;
        color: $color-white;
      }
    }
  }

  .botao-aplicacao {
    height: 40px;
    width: 150px;
  }

  .administracoes {
    margin-top: 1rem;

    .tabela-schema {
      padding: 0px
    }

    .nenhuma-aplicacao {
      color: $color-primary;
      margin: auto;
      width: fit-content;
    }
  }
}
</style>

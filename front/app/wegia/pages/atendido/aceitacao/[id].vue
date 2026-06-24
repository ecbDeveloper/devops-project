<template>
  <section class="tabela-atendido-aceitacao-etapa">

    <div>
      <Butao
        class="atualizar-status"
        texto="Atualizar Status"
        @click="modalStatus = true"
        v-if="pessoaStore.possuiPermissao(Permissao.SINCRONIZAR_PAGAMENTO)"
      />

      <Butao
        class="nova-etapa"
        texto="Nova Etapa"
        @click="() => modalFormEtapa(null)"
        v-if="pessoaStore.possuiPermissao(Permissao.SINCRONIZAR_PAGAMENTO)"
      />
    </div>

    <tabela-schema
      titulo="Aceitação de Atendidos Etapas"
      :linhas="etapas"
      :cabecalhos="[
          { nome: 'Data Inicio', chave: 'data_inicio', ordenavel: false },
          { nome: 'Data Fim', chave: 'data_fim', ordenavel: false },
          { nome: 'Status', chave: 'status_nome', ordenavel: false },
          { nome: 'Descricao', chave: 'descricao', ordenavel: false },
          { nome: 'Ações', chave: 'acao', ordenavel: false }
      ]"
      :acao="['editar']"
      :atualizacao="atualizarPagina"
      :mostrarFiltros="false"
      :mostrarTextoPaginacao="false"
      :mostrarPaginacao="false"
      @editar="modalFormEtapa"
    >
      <template #acao="{ linha }">
        <i class="fas fa-file" @click="mostrarArquivos(linha as AtendidoAceitacaoEtapaInterface)"></i>
      </template>
    </tabela-schema>

  </section>

  <modal-cadastrar-atendido-aceitacao-etapa
    v-if="modalCadastrarAberto"
    :etapa="etapaEditar"
    :id_processo="id_processo"
    @fechar-modal="modalFormEtapa"
    @buscar="buscarAtendidoAceitacaoEtapa"
  />

  <modal-pessoa-atendido-aceitacao-arquivos
    v-if="etapaAberta"
    :arquivos="etapaAberta.arquivos"
    @enviar-arquivo="enviarArquivo"
    @fechar-modal="mostrarArquivos"
  />

  <modal-atualizar-atendido-aceitacao-status
    v-if="modalStatus"
    :id_status="atendidoAceitacaoStore.getAtendidoAceitacaoPorId.id_status"
    @fechar-modal="modalStatus = false"
    @atualizar="atualizarStatus"
  />

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_CONTRIBUICOES
})

const router = useRouter();
const atendidoAceitacaoStore      = useAtendidoAceitacaoStore()
const atendidoAceitacaoEtapaStore = useAtendidoAceitacaoEtapaStore()
const pessoaStore                 = usePessoaStore()
const alertStore                  = useAlertStore()

const id_processo          = Number(router.currentRoute.value.params.id);
const atualizarPagina      = ref(1)
const etapaAbertaId        = ref<number | null>(null)
const etapaEditar          = ref<AtendidoAceitacaoEtapaInterface | null>(null)
const modalCadastrarAberto = ref(false)
const modalStatus          = ref(false)

const etapaAberta = computed(() => {
  if(!etapaAbertaId.value) return null

  return atendidoAceitacaoStore?.getAtendidoAceitacaoPorId?.etapas?.find((item) => item.id === etapaAbertaId.value) ?? null
})

const etapas = computed(() => {
  const a = atendidoAceitacaoStore?.getAtendidoAceitacaoPorId ?? {}

  return a.etapas?.map((item) => {
    return {
      ...item,
      status_nome: item.status.descricao
    }
  }) ?? []
})

const buscarAtendidoAceitacaoEtapa = async () => {
  const id: number = Number(router.currentRoute.value.params.id);
  await atendidoAceitacaoStore.fetchAtendidoAceitacaoPorId(id)
}

const mostrarArquivos = (linha: AtendidoAceitacaoEtapaInterface | null = null) => {
  etapaAbertaId.value = linha?.id ?? null
}

const enviarArquivo = async (arquivo: File) => {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  if(!etapaAbertaId.value || !arquivo) return

  try {
    await atendidoAceitacaoEtapaStore.fetchAtendidoAceitacaoEtapaArquivoCadastrar(etapaAbertaId.value, formData)

    await buscarAtendidoAceitacaoEtapa()
    alertStore.mostrarAlerta('success', 'Arquivo cadastrado com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao enviar o arquivo!')
  }
}

const modalFormEtapa = (linha: AtendidoAceitacaoEtapaInterface | null = null) => {
  etapaEditar.value = linha
  modalCadastrarAberto.value = !modalCadastrarAberto.value
}

const atualizarStatus = async (id_status: number) => {

  try {
    const id = atendidoAceitacaoStore.getAtendidoAceitacaoPorId.id

    await atendidoAceitacaoStore.fetchAtendidoAceitacaoAtualizar(id, { id_status: Number(id_status) })
    buscarAtendidoAceitacaoEtapa()
    modalStatus.value = false
    alertStore.mostrarAlerta('success', 'Status atualizado com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao atualizar status!')
  }

}

onMounted(async () => {
  await buscarAtendidoAceitacaoEtapa()

  if(!atendidoAceitacaoStore.getStatusParaSelect.length) await atendidoAceitacaoStore.fetchAtendidoAceitacaoStatus()
})

</script>

<style lang="scss">

.tabela-atendido-aceitacao-etapa {

  .nova-etapa, .atualizar-status {
    height: 36px;
    margin: 48px;
    width: 128px;
  }

  .fa-file {
    background-color: $color-quinary;
    border-radius: 8px;
    color: $color-white;
    padding: 12px;
  }
}


</style>
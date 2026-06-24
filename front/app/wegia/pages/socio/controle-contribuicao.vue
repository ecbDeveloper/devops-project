<template>
  <section class="tabela-contribuicao">

    <Butao
      class="sincronizar"
      texto="Sincronizar Pagamentos"
      @click="sincronizar"
      v-if="pessoaStore.possuiPermissao(Permissao.SINCRONIZAR_PAGAMENTO)"
    />

    <tabela-schema
      titulo="Tag"
      :isLoading="isLoading"
      :paginacao="contribuicoes"
      :linhas="contribuicoes?.items ?? []"
      :cabecalhos="[
          { nome: 'Código', chave: 'codigo', ordenavel: false },
          { nome: 'Socio', chave: 'nome', ordenavel: true },
          { nome: 'Plataforma', chave: 'plataforma', ordenavel: true },
          { nome: 'M. Pagamento', chave: 'meio_pagamento', ordenavel: true },
          { nome: 'D. emissão', chave: 'data_geracao', ordenavel: true },
          { nome: 'D. vencimento', chave: 'data_vencimento', ordenavel: true },
          { nome: 'D. pagamento', chave: 'data_pagamento', ordenavel: true },
          { nome: 'Valor', chave: 'valor', ordenavel: true },
          { nome: 'Status', chave: 'status_pagamento', ordenavel: true },
      ]"
      :atualizacao="atualizarPagina"
      @buscar="buscarContribuicoes"
    >

      <template #filtro>

        <InputSelect
          label="Período"
          v-model="periodo"
          opcaoDefault="Todos"
          :opcoes="periodos"
          @select-change="buscarContribuicoes"
        />

        <InputSelect
          label="Status"
          v-model="status"
          opcaoDefault="Todos"
          :opcoes="[
            { texto: 'Pendente', value: '0' },
            { texto: 'Pago', value: '1' }
          ]"
          @select-change="buscarContribuicoes"
        />

      </template>

    </tabela-schema>

  </section>

  <Modal
    v-if="modalSincronizar"
    :aparecerX="false"
    class="modal-sincronizar"
  >

    <div class="textos" >
      <h2>{{ tituloModal }}</h2>
      <p>{{ textoModal }}</p>

      <div class="icone-status">
        <Loading v-if="statusModal === 'loading'" />

        <i
          v-else-if="statusModal === 'success'"
          class="fas fa-check-circle sucesso"
        />

        <i
          v-else-if="statusModal === 'error'"
          class="fas fa-times-circle erro"
        />
      </div>

    </div>

  </Modal>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_CONTRIBUICOES
})

const contribuicaoStore = useContribuicaoStore()
const contribuicaoPagamentoStore = useContribuicaoPagamentoStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const periodo = ref('')
const status = ref('')
const modalSincronizar = ref(false)

const statusModal = ref('loading')
const tituloModal = ref('Sincronizando Pagamentos')
const textoModal = ref('Isso pode levar alguns minutos.')

const contribuicoes = computed(() => {
  const c = contribuicaoStore?.getContribuicoes ?? {}

  const items = c.items?.map((item) => {
    return {
      ...item,
      nome: item.socio.pessoa.nome,
      plataforma: item.gateway.plataforma,
      meioPagamento: item.meio_pagamento ,
      meio_pagamento: item.meio_pagamento.meio,
      status_pagamento: item.status_pagamento === 1 ? 'Pago' : 'Pendente'
    }
  })

  return {
    ...c,
    items: items
  }
})

const buscarContribuicoes = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<SocioControleContribuicaoBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(status.value) paramsLocal.status = status.value
  if(periodo.value) paramsLocal.periodo = periodo.value

  isLoading.value = true
  await contribuicaoStore.fetchContribuicao(paramsLocal)
  isLoading.value = false
}

const periodos = computed(() => {
  const hoje = new Date()
  const diaAtual = hoje.getDate()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()

  const diasDoMesAtual = diaAtual

  const primeiroDiaBimestre = new Date(anoAtual, mesAtual - 1, 1)
  const diasDoBimestre = Math.floor((hoje.getTime() - primeiroDiaBimestre.getTime()) / (1000 * 60 * 60 * 24))

  const primeiroDiaTrimestre = new Date(anoAtual, mesAtual - 2, 1)
  const diasDoTrimestre = Math.floor((hoje.getTime() - primeiroDiaTrimestre.getTime()) / (1000 * 60 * 60 * 24))

  const primeiroDiaSemestre = new Date(anoAtual, mesAtual - 5, 1)
  const diasDoSemestre = Math.floor((hoje.getTime() - primeiroDiaSemestre.getTime()) / (1000 * 60 * 60 * 24))

  const primeiroDiaAno = new Date(anoAtual, 0, 1)
  const diasDoAno = Math.floor((hoje.getTime() - primeiroDiaAno.getTime()) / (1000 * 60 * 60 * 24))

  return [
    { texto: 'Mês Atual', value: diasDoMesAtual },
    { texto: 'Bimestre', value: diasDoBimestre },
    { texto: 'Trimestre', value: diasDoTrimestre },
    { texto: 'Semestre', value: diasDoSemestre },
    { texto: 'Ano Atual', value: diasDoAno }
  ]
})

const sincronizar = async () => {
  modalSincronizar.value = true
  statusModal.value = 'loading'

  tituloModal.value = 'Sincronizando Pagamentos'
  textoModal.value = 'Isso pode levar alguns minutos.'

  try {
    await contribuicaoPagamentoStore.fetchPagamentoSincronizar()

    statusModal.value = 'success'
    tituloModal.value = 'Sincronização concluída'
    textoModal.value = 'Pagamentos sincronizados com sucesso!'

    atualizarPagina.value++
    alertStore.mostrarAlerta('success', 'Pagamentos sincronizados com sucesso!')

  } catch (e) {
    statusModal.value = 'error'
    tituloModal.value = 'Erro na sincronização'
    textoModal.value = 'Não foi possível sincronizar os pagamentos.'

    alertStore.mostrarAlerta('error', 'Erro ao sincronizar pagamentos!')
  }

  setTimeout(() => {
    modalSincronizar.value = false
    statusModal.value = 'loading'

    tituloModal.value = 'Sincronizando Pagamentos'
    textoModal.value = 'Isso pode levar alguns minutos.'
  }, 3000)
}

onMounted(async () => {
  const contribuicoesLocal = contribuicaoStore.getContribuicoes
  if(
    !contribuicoesLocal.items ||
    contribuicoesLocal?.items?.length == 0
  ) await buscarContribuicoes()

  isLoading.value = false
})

</script>

<style lang="scss">

.tabela-contribuicao {

  .sincronizar {
    height: 36px;
    margin: 48px;
    width: 256px;
  }
}

.modal-sincronizar {
  .modal {
    .textos {
      align-items: center;
      display: flex;
      flex-direction: column;
    }

    .icone-status {
      margin-top: 16px;

      i {
        font-size: 48px;
      }

      .sucesso {
        color: $color-primary;
      }

      .erro {
        color: $color-error;
      }
    }
  }
}

</style>
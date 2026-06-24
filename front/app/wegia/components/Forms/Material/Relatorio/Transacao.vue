<template>

  <div class="forms-material-relatorio-transacao">

      <forms-material-relatorio-input-dos-dias
          @atualizar-periodo="atualizarPeriodo"
        />


        <InputText
          v-model="periodoInicial"
          label="Período"
          placeholder="dd/mm/aaaa"
          mask="##/##/####"
          :regex=/\D/g
          :erro="erroPeriodoInicial"
        />

        <InputText
          v-model="periodoFinal"
          label=" "
          placeholder="dd/mm/aaaa"
          mask="##/##/####"
          :regex=/\D/g
          :erro="erroPeriodoFinal"
        />

        <InputSelect
          :label="tipo === 'e' ? 'Origem' : 'Destino'"
          v-model="origemSaida"
          :opcoes="origemSaidaOpcoes"
        />

        <InputSelect
          :label="tipo === 'e' ? 'Tipo de Entrada' : 'Tipo de Saída'"
          v-model="tipoMovimentacao"
          :opcoes="tipoOpcoes"
        />

        <InputSelect
          label="Responsável"
          v-model="responsavel"
          :opcoes="responsaveisOpcoes"
        />

        <InputSelect
          label="Almoxarifado"
          v-model="almoxarifado"
          :opcoes="almoxarifadoOpcoes"
        />

        <div class="div-botao">
          <butao texto="gerar" @click-botao="gerarRelatorio" />
        </div>
  </div>

  <modal-material-relatorio-transacao
    v-if="modalAberto"
    :tipo
    :periodoInicial
    :periodoFinal
    :almoxarifado="almoxarifadoSelecionado?.texto"
    :responsavel="responsavelSelecionado?.texto"
    :origemSaida="origemSaidaSelecionado?.texto"
    :tipoMovimentacao="tipoMovimentacaoSelecionado?.texto"
    @fechar-modal="toggleModal"
  />

</template>

<script setup lang="ts">

const props = defineProps<{
  tipo: 'e' | 's'
}>()

const materialTipoMovimentacaoStore = useMaterialTipoMovimentacaoStore()
const materialParceiroStore         = useMaterialParceiroStore()
const materialAlmoxarifadoStore     = useMaterialAlmoxarifadoStore()
const materialTransacaoStore        = useMaterialTransacaoStore()
const materialRelatorioStore        = useMaterialRelatorioStore()

const tipoOpcoes         = computed(() => materialTipoMovimentacaoStore.getTipoMovimentacaoParaFiltrosParaSelect)
const origemSaidaOpcoes  = computed(() => materialParceiroStore.getParceiroParaFiltrosParaSelect)
const almoxarifadoOpcoes = computed(() => materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect)
const responsaveisOpcoes = computed(() => materialTransacaoStore.getResponsaveisParaSelect)

const almoxarifadoSelecionado = computed(() => {
  return almoxarifadoOpcoes.value.find(
    a => a.value === Number(almoxarifado.value)
  )
})
const origemSaidaSelecionado = computed(() => {
  return origemSaidaOpcoes.value.find(a => a.value === Number(origemSaida.value))
})
const responsavelSelecionado = computed(() => {
  return responsaveisOpcoes.value.find(a => a.value === Number(responsavel.value))
})
const tipoMovimentacaoSelecionado = computed(() => {
  return tipoOpcoes.value.find(a => a.value === Number(tipoMovimentacao.value))
})

const modalAberto      = ref(false)
const periodoInicial   = ref('')
const periodoFinal     = ref('')
const origemSaida      = ref('')
const tipoMovimentacao = ref('')
const responsavel      = ref('')
const almoxarifado     = ref('')

const erroPeriodoInicial = ref('')
const erroPeriodoFinal   = ref('')

const toggleModal = () => { modalAberto.value = !modalAberto.value }

const gerarRelatorio = async () => {
  const hoje = new Date()
  erroPeriodoInicial.value = ''
  erroPeriodoFinal.value = ''

  let dataInicio: Date | null = null
  let dataFim: Date | null = null

  if (periodoInicial.value) {
    const [dia, mes, ano] = periodoInicial.value.split('/')
    dataInicio = new Date(`${ano}-${mes}-${dia}`)

    if (Number.isNaN(dataInicio.getTime())) {
      erroPeriodoInicial.value = 'O período inicial é inválido.'
      return
    }
  }

  if (periodoFinal.value) {
    const [dia, mes, ano] = periodoFinal.value.split('/')
    dataFim = new Date(`${ano}-${mes}-${dia}`)

    if (Number.isNaN(dataFim.getTime())) {
      erroPeriodoInicial.value = 'O período final é inválido.'
      return
    }
  }

  if (dataInicio && dataInicio > hoje) {
    erroPeriodoInicial.value = 'O período inicial não pode ser maior que hoje.'
    return
  }

  if (dataInicio && dataFim && dataFim < dataInicio) {
    erroPeriodoFinal.value = 'O período final não pode ser menor que o período inicial.'
    return
  }

  try {
    const params: Partial<MaterialRelatorioBuscarTodosParamsInterface> = {}
    params.tipo_movimentacao = props.tipo

    if (dataInicio) params.periodo_inicial = dataInicio.toISOString().split('T')[0]
    if (dataFim)    params.periodo_final   = dataFim.toISOString().split('T')[0]

    if (origemSaida.value)      params.id_parceiro       = origemSaida.value
    if (tipoMovimentacao.value) params.id_tipo_movimentacao = tipoMovimentacao.value
    if (responsavel.value)      params.id_responsavel    = responsavel.value
    if (almoxarifado.value)     params.id_almoxarifado   = almoxarifado.value

    await materialRelatorioStore.fetchRelatorio(params)

    toggleModal()
  } catch (e) {
    console.log(e)
  }
}

const atualizarPeriodo = (obj: {inicio: string, fim: string}) => {
  periodoInicial.value = obj.inicio
  periodoFinal.value = obj.fim
}

onMounted(async () => {
  await materialTipoMovimentacaoStore.fetchTipoMovimentacaoParaFiltros({ tipo: props.tipo })
  if(!materialParceiroStore.getParceiroParaFiltrosParaSelect.length) await materialParceiroStore.fetchParceiroParaFiltros()
  if(!materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect.length) await materialAlmoxarifadoStore.fetchAlmoxarifadoParaFiltros()
  if(!materialTransacaoStore.getResponsaveisParaSelect.length) await materialTransacaoStore.fetchTransacaoResponsaveis()
})

</script>

<style scoped lang="scss">

.forms-material-relatorio-transacao {

  .div-botao {
    justify-content: flex-end;
    display: flex;

    button {
      height: 32px;
      width: 96px;
    }
  }
}

</style>
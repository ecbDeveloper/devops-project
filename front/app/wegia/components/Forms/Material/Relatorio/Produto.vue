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
          label="Almoxarifado"
          v-model="almoxarifado"
          :opcoes="almoxarifadoOpcoes"
        />

        <InputSelect
          label="Produtos"
          v-model="produto"
          :erro="erroProduto"
          :opcoes="produtoOpcoes"
        />

        <div class="div-botao">
          <butao texto="gerar" @click-botao="gerarRelatorio" />
        </div>

        <modal-material-relatorio-produto
          v-if="modalAberto"
          :almoxarifado="almoxarifadoSelecionado?.texto"
          :periodoInicial
          :periodoFinal
          @fechar-modal="toggleModal"
        />
  </div>
</template>

<script setup lang="ts">

const materialPrododutoStore    = useMaterialProdutoStore()
const materialAlmoxarifadoStore = useMaterialAlmoxarifadoStore()
const materialRelatorioStore    = useMaterialRelatorioStore()

const almoxarifadoOpcoes = computed(() => materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect)
const produtoOpcoes      = computed(() => materialPrododutoStore.getProdutoParaFiltrosParaSelect)

const almoxarifadoSelecionado = computed(() => {
  return almoxarifadoOpcoes.value.find(a => a.value === Number(almoxarifado.value))
})

const modalAberto      = ref(false)
const periodoInicial   = ref('')
const periodoFinal     = ref('')
const almoxarifado     = ref('')
const produto          = ref('')

const erroPeriodoInicial = ref('')
const erroPeriodoFinal   = ref('')
const erroProduto        = ref('')

const toggleModal = () => { modalAberto.value = !modalAberto.value }

const gerarRelatorio = async () => {
  erroPeriodoInicial.value = ''
  erroPeriodoFinal.value   = ''
  erroProduto.value        = ''

  const hoje = new Date()

  let dataInicio: Date | null = null
  let dataFim: Date | null    = null

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

  if(!produto.value) return erroProduto.value = 'O produto deve ser preenchido!'

  try {
    const params: Partial<MaterialRelatorioProdutoBuscarTodosParamsInterface> = {}

    if (dataInicio) params.periodo_inicial = dataInicio.toISOString().split('T')[0]
    if (dataFim)    params.periodo_final   = dataFim.toISOString().split('T')[0]

    if (almoxarifado.value) params.id_almoxarifado = almoxarifado.value
    if (produto.value)      params.id_produto      = produto.value

    await materialRelatorioStore.fetchRelatorioProduto(params)

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
  if(!materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect.length) await materialAlmoxarifadoStore.fetchAlmoxarifadoParaFiltros()
  if(!materialPrododutoStore.getProdutoParaFiltrosParaSelect.length) await materialPrododutoStore.fetchProdutosParaFiltros()
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
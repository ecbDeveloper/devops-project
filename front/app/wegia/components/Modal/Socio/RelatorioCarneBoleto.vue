<template>

  <Modal @fechar-modal="emit('fechar-modal')" class="modal-relatorio-carne-boleto">

    <div v-if="isLoading" class="loading">

      <h2>Criando Pagamento</h2>

      <Loading />
    </div>

    <div v-else>
      <p>Socio: <strong>{{ socio.nome }}</strong></p>
      <p>Valor total: <strong>R$ {{ String((Number(formulario.valor) * Number(formulario.parcelas)).toFixed(2)).replace('.', ',') }}</strong></p>

      <tabela-schema
        titulo="Relatorio Carne e Boleto"
        :isLoading="false"
        :paginacao="null"
        :atualizacao="0"
        :mostrarPaginacao=false
        :mostrarFiltros="false"
        :linhas="tabelaForm"
        :cabecalhos="[
          { nome: 'Parcela', chave: 'parcela', ordenavel: false },
          { nome: 'Data de vencimento', chave: 'data_vencimento', ordenavel: false },
          { nome: 'Valor Parcela', chave: 'valor_parcela', ordenavel: false }
        ]"
      />

      <Butao
        texto="Gerar Pagamento"
        @click-botao="gerarPagamento"
      />
    </div>
  </Modal>

</template>

<script setup lang="ts">

interface formularioType {
  metodo: string
  data_vencimento: string
  valor: string
  modo_geracao: number
  parcelas: string
}

const props = defineProps<{
  formulario: formularioType
  socio: SocioPublicoInterface
  meioPagamento: ContribuicaoMeioPagamentoAtivoInterface
}>()

const emit = defineEmits(['fechar-modal'])

const contribuicaoPagamentoStore = useContribuicaoPagamentoStore()
const alertStore                 = useAlertStore()

const isLoading = ref(false)

const mapaMeses: Record<string, number> = {
  'carne mensal': 1,
  'carne bimestral': 2,
  'carne trimestral': 3,
  'carne semestral': 6
}

const tabelaForm = computed(() => {
  const {
    metodo,
    data_vencimento,
    valor,
    modo_geracao,
    parcelas
  } = props.formulario

  if (!metodo || !data_vencimento || !valor) return []

  const valorParcela = valor.replace('.', ',')

  if (metodo === 'boleto') {
    return [
      {
        parcela: `1 / ${props.formulario.parcelas}`,
        data_vencimento: formatarDataBR(parseData(data_vencimento)),
        valor_parcela: valorParcela
      }
    ]
  }

  const intervaloMeses = mapaMeses[metodo]
  if (!intervaloMeses) return []

  const dataInicial = parseData(data_vencimento)

  let totalParcelas = Number(parcelas)

  if (modo_geracao === 1) {
    const ano = dataInicial.getFullYear()
    let contador = 0
    let dataTemp = new Date(dataInicial)

    while (dataTemp.getFullYear() === ano) {
      contador++
      dataTemp = adicionarMeses(dataTemp, intervaloMeses)
    }

    totalParcelas = contador
  }

  return Array.from({ length: totalParcelas }, (_, index) => {
    const dataParcela = adicionarMeses(
      dataInicial,
      index * intervaloMeses
    )

    return {
      parcela: `${index + 1} / ${props.formulario.parcelas}`,
      data_vencimento: formatarDataBR(dataParcela),
      valor_parcela: valorParcela
    }
  })
})

const parseData = (data: string): Date => {
  if (data.includes('/')) {
    const [d, m, a] = data.split('/')
    return new Date(Number(a), Number(m) - 1, Number(d))
  }
  return new Date(data)
}

const adicionarMeses = (data: Date, meses: number): Date => {
  const dia = data.getDate() + 1
  const mes = data.getMonth()
  const ano = data.getFullYear()

  const novoMes = mes + meses
  const novoAno = ano + Math.floor(novoMes / 12)
  const mesAjustado = ((novoMes % 12) + 12) % 12

  const ultimoDiaDoMes = new Date(novoAno, mesAjustado + 1, 0).getDate()

  const diaFinal = dia > ultimoDiaDoMes ? ultimoDiaDoMes : dia

  return new Date(novoAno, mesAjustado, diaFinal)
}

const formatarDataBR = (data: Date): string => data.toISOString().slice(0, 10).split('-').reverse().join('/')

const gerarPagamento = async () => {

  isLoading.value = true

  try {
    await contribuicaoPagamentoStore.fetchPagamento({
      id_socio: Number(props.socio.id_socio),
      id_contribuicao_meioPagamento: Number(props.meioPagamento.id),
      valor: Number(props.formulario.valor),
      parcelas: Number(props.formulario.parcelas),
      data_vencimento_completa: props.formulario.data_vencimento,
      intervalo: mapaMeses[props.formulario.metodo]
    })

    const tipoPagamento = Pagamento.execucaoAposCriadoPagamento(
      contribuicaoPagamentoStore.getContribuicaoPagamento,
      props.socio
    )

    alertStore.mostrarAlerta('success', `Pagamento via ${tipoPagamento} criado com sucesso!`)
    emit('fechar-modal')

  } catch (e) {

    alertStore.mostrarAlerta('error', `Erro ao carregar pagamento!`)
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped lang="scss">

.modal-relatorio-carne-boleto {
  .loading {
    h2 {
      margin-top:24px;
      text-align: center;
    }
  }
}

</style>
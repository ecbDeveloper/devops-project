<template>

  <div class="forms-socio-gerar-carne-boleto">

    <BreadCrumbTimeLine
      :steps="etapas"
      :currentStep="etapaAtual"
      @navigate="handleStepChange"
    />

    <Forms
      v-if="etapaAtual == 1"
      textoBotao="Buscar Sócio"
      :formulario="formularioSocio"
      @enviarFormulario="buscarSocio"
    />

    <Forms
      v-if="etapaAtual == 2"
      textoBotao="Gerar Carne ou Boleto"
      :formulario="formulario"
      @enviarFormulario="gerarCarneeBoleto"
    />
  </div>

  <modal-socio-relatorio-carne-boleto
    v-if="formModalAberto && socioUsado && meioPagamentoUsado"
    :formulario="formModalAberto"
    :socio="socioUsado"
    :meioPagamento="meioPagamentoUsado"
    @fechar-modal="formModalAberto = null"
  />

</template>

<script setup lang="ts">

import { gerarRelatorioSocio, procurarSocio } from '~/forms/Socio/GerarCarneEBoleto';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_SOCIO_RELATORIO
})

const contribuicaoMeioPagamentoStore = useContribuicaoMeioPagamentoStore()
const socioStore                     = useSocioStore()

const formularioSocio    = ref(procurarSocio)
const formulario         = ref(gerarRelatorioSocio)
const formModalAberto    = ref(null)
const meioPagamentoUsado = ref<ContribuicaoMeioPagamentoAtivoInterface | null>(null)

const etapaAtual = ref(1);
const etapas = [
    { label: 'Buscar Sócio', icon: 'fa-solid fa-magnifying-glass' },
    { label: 'Gerar Pagamento', icon: 'fa-solid fa-file-invoice-dollar' }
]

const socioUsado = computed(() => socioStore.getSocioPublico)

const handleStepChange = (index: number) => { if(index + 1 <= etapaAtual.value) etapaAtual.value = index + 1 }

const buscarSocio = async () => {

  const validacao = await ValidateForm.validate([formularioSocio.value])

  if(!validacao)  return

  const form = formatFormToJson([formularioSocio.value])

  try {
    await socioStore.fetchSocioPublico(form.cpf)
    etapaAtual.value++
  } catch (e: any) {
    if(e.status == 404) return mudandoCampoNoForm(formularioSocio.value, 'cpf', 'erro', 'Sócio não existe')
  }
}

const gerarCarneeBoleto = async () => {
  formModalAberto.value    = null
  meioPagamentoUsado.value = null

  const meiosDePagamento   = contribuicaoMeioPagamentoStore.getMeiosAtivos

  const form      = formatFormToJson([formulario.value])
  const validacao = await ValidateForm.validate([formulario.value])

  const meio = meiosDePagamento.find(meio =>
    meio.meio.toLowerCase().includes(form.metodo.replace(' ', '')[0])
  )

  if(!meio) return

  const validarValor = ValidateForm.validarCampoComRegras({
    valor: form.valor,
    regras: meio?.regras
  })

  if(!validarValor.valido) return mudandoCampoNoForm(formulario.value, 'valor', 'erro', validarValor.mensagem ?? '')

  if(!validacao)  return

  meioPagamentoUsado.value = meio
  formModalAberto.value    = form

}

watch(
  formulario,
  (novo) => {

    const form = formatFormToJson([formulario.value])

    if(form.modo_geracao === 1) {
      mudandoCampoNoForm(formulario.value, 'parcelas', 'invisivel', true)
    } else {
      mudandoCampoNoForm(formulario.value, 'parcelas', 'invisivel', false)
    }

    if(form.metodo === 'boleto') {
      mudandoCampoNoForm(formulario.value, 'modo_geracao', 'value', 0)
      mudandoCampoNoForm(formulario.value, 'modo_geracao', 'invisivel', true)

      mudandoCampoNoForm(formulario.value, 'parcelas', 'invisivel', false)
      mudandoCampoNoForm(formulario.value, 'parcelas', 'value', 1)
      mudandoCampoNoForm(formulario.value, 'parcelas', 'desabilitado', true)
    } else {
      mudandoCampoNoForm(formulario.value, 'modo_geracao', 'invisivel', false)
      mudandoCampoNoForm(formulario.value, 'parcelas', 'desabilitado', false)
    }

  },
  { deep: true }
)

onMounted(async () => {
  if(contribuicaoMeioPagamentoStore.getMeiosAtivos) await contribuicaoMeioPagamentoStore.fetchMeiosAtivos()

  let opcoes = []

  const meiosAtivos = contribuicaoMeioPagamentoStore.getMeiosAtivos

  const temBoleto = meiosAtivos.some(meio =>
    meio.meio.toLowerCase().includes('boleto')
  )

  const temCarne = meiosAtivos.some(meio =>
    meio.meio.toLowerCase().includes('carnê') ||
    meio.meio.toLowerCase().includes('carne')
  )

  if(temBoleto) opcoes.push({ texto: 'Boleto único', value: 'boleto' })

  if(temCarne) opcoes.push(
    { texto: 'Carnê mensal', value: 'carne mensal' },
    { texto: 'Carnê bimestral', value: 'carne bimestral' },
    { texto: 'Carnê trimestral', value: 'carne trimestral' },
    { texto: 'Carnê semestral', value: 'carne semestral' }
  )

  mudandoCampoNoForm(formulario.value, 'metodo', 'opcoes', opcoes)

})

</script>

<style scoped lang="scss">

.forms-socio-gerar-carne-boleto {

  padding: 24px;

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
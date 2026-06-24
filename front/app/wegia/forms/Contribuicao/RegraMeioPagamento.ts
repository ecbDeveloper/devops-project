import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const cadastrarRegraMeioPagamento = {
  titulo: '',
  itens: [
      {
        nome: 'id_meioPagamento',
        label: "Meio de pagamento",
        type: 'select',
        storeOpcoes: {
          store: useContribuicaoMeioPagamentoStore,
          stateProp: 'getMeiosFiltros'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_regra',
        label: "Regra",
        type: 'select',
        storeOpcoes: {
          store: useContribuicaoRegraStore,
          stateProp: 'getRegrasFiltro'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'valor',
        label: "Valor",
        placeholder: "Ex. 12,24",
        type: 'text',
        value: '',
        erro: '',
        regex: /[^0-9,]/g,
        validacao: ValidateForm.obrigatorio,
        formatarParaAdicionarNoForm: FormatarParaForm.formatarDinheiro,
        obrigatorio: true
      },
      {
        nome: 'status',
        label: "Status",
        type: 'radio',
        value: 0,
        erro: '',
        opcoes: [
            { value: 0, texto: 'Desativado' },
            { value: 1, texto: 'Ativado' }
        ]
      }
  ]
}

export const enviarCadastrarRegraMeioPagamento = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const contribuicaoRegraStore = useContribuicaoRegraStore()
  const alertStore = useAlertStore()

  const v = await validacao(formulario)

  if(v.status != 200) return v

  try {
    await contribuicaoRegraStore.fetchCadastrarRegraMeioPagamento(v.json)
    alertStore.mostrarAlerta('success', 'Sucesso ao cadastrar regra de meio de pagamento!')
  } catch (e) {
    const error = e as FetchError<ErroApiInterface>

    if (error.response?._data?.errors?.id_regra?.some((msg : string) => msg.includes('conjunto cadastrado'))) {
      alertStore.mostrarAlerta('error', `Esse meio de pagamento Já possui essa regra!`)
    } else {
      alertStore.mostrarAlerta('error', 'Erro ao atualizar regra de meio de pagamento!')
    }

    throw error
  }
}

export const enviarAtualizarRegraMeioPagamento = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] }
) => {

  const contribuicaoRegraStore = useContribuicaoRegraStore()
  const alertStore = useAlertStore()

  const v = await validacao(formulario)

  if(v.status != 200) return v

  try {
    await contribuicaoRegraStore.fetchAtualizarRegraMeioPagamento(id, v.json)
    alertStore.mostrarAlerta('success', 'Sucesso ao atualizar regra de meio de pagamento!')
  } catch (e) {
    const error = e as FetchError<ErroApiInterface>

    if (error.response?._data?.errors?.id_regra?.some((msg : string) => msg.includes('conjunto cadastrado'))) {
      alertStore.mostrarAlerta('error', `Esse meio de pagamento Já possui essa regra!`)
    } else {
      alertStore.mostrarAlerta('error', 'Erro ao atualizar regra de meio de pagamento!')
    }

    throw error
  }
}

const validacao = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([ formulario])

  const [inteiro, decimal] = data.valor.split(',');

  if (decimal && decimal.length > 2) {
    setErroPorNome(formulario, 'valor', 'Máximo de duas casas decimais permitidas');
    return { status: 422, json: {} };
  }

  data.valor = data.valor.replace(',', '.');

  return {status: 200, json: data}
}

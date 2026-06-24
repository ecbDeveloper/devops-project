import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const cadastrarMeioPagamento = {
  titulo: '',
  itens: [
      {
        nome: 'id_plataforma',
        label: "Plataforma",
        type: 'select',
        storeOpcoes: {
          store: useContribuicaoGatewayStore,
          stateProp: 'getGatewaysFiltros'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
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
      },
  ]
}

export const enviarAtualizarMeioPagamento = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] }
) => {

  const contribuicaoMeioPagamento = useContribuicaoMeioPagamentoStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([formulario])

  try {
    await contribuicaoMeioPagamento.fetchAtualizarMeio(id, data)
    alertStore.mostrarAlerta('success', 'Sucesso ao atualizar meio de pagamento!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao atualizar meio de pagamento!')
    throw e as FetchError<ErroApiInterface>
  }
}

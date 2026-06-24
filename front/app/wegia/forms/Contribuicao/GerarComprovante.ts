import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const gerarComprovante = {
  titulo: '',
  itens: [
      {
        nome: 'cpf_cnpj',
        label: "CPF/CNPJ",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.cpfCnpj,
        formatarParaEnviar: [/\D/g, ''],
        validacao: ValidateForm.cpfOuCnpjValidacao,
        obrigatorio: true
      },
      {
        nome: 'data_inicio',
        label: "Data Inicio",
        placeholder: 'DD/mm/aaaa',
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: Mascara.data,
        formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'data_fim',
        label: "Data Fim",
        placeholder: 'DD/mm/aaaa',
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: Mascara.data,
        formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      }
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

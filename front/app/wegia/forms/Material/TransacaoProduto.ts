import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const atualizarTransacaoProduto = {
  titulo: '',
  itens: [
    {
      nome: 'quantidade',
      label: "Quantidade",
      type: 'text',
      value: '',
      erro: '',
      regex: /[^0-9]/g,
      validacao: ValidateForm.obrigatorio,
      obrigatorio: true
    },
    {
      nome: 'valor_unitario',
      label: "Valor Unitário",
      placeholder: '12,90',
      type: 'text',
      value: '',
      erro: '',
      regex: /[^0-9,]/g,
      validacao: ValidateForm.obrigatorio,
      obrigatorio: true
    }
  ]
}

export const enviarAtualizarTransacaoProduto = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const alertStore = useAlertStore()
  const materialTransacaoProdutoStore = useMaterialTransacaoProdutoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([formulario])

  data.valor_unitario = data.valor_unitario.replace(",", ".")

  try {
    await materialTransacaoProdutoStore.fetchAtualizarTransacaoProduto(id, data)

    return {status: 200, json: {}}
  } catch (e) {
    const error = e as FetchError<any>
    alertStore.mostrarAlerta("error", "Erro ao atualizar transacao produtos!")
    throw error
  }

}
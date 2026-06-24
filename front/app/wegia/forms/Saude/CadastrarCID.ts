
export const cadastrarCID = {
  titulo: '',
  itens: [
      {
        nome: 'CID',
        label: "CID",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.cidValido,
        obrigatorio: true,
        max: 10
     },
      {
          nome: 'descricao',
          label: "Descrição",
          type: 'text',
          value: '',
          erro: '',
          validacao: ValidateForm.obrigatorio,
          obrigatorio: true,
          max: 255,
      }
  ]
}

export const enviaCID = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeCIDStore = useSaudeCIDStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario]) as SaudeCIDCadastrarInterface

  try {
      await saudeCIDStore.fetchCidCadastrar(json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'CID cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar CID!')
      throw e
  }

}
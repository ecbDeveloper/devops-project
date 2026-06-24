export const cadastrarIntercorrencia = {
  titulo: '',
  itens: [
      {
        nome: 'descricao',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
        bloqueado: false,
      }
  ]
}

export const enviarIntercorrencia = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeIntercorrenciaStore = useSaudeIntercorrenciaStore()
  const pessoaStore = usePessoaStore()
  const alertStore = useAlertStore()

  if(!pessoaStore.getPessoa?.funcionario) {
    return alertStore.mostrarAlerta('error', 'Você não é um funcionario!')
  }

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario])
  json.id_funcionario = pessoaStore.getPessoa.funcionario.id_funcionario

  try {
      await saudeIntercorrenciaStore.fetchCadastrarIntercorrencia(id, json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Intercorrencia cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar intercorrencia!')
      throw e
  }

}
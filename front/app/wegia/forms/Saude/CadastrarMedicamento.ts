
export const cadastrarMedicamento = {
  titulo: '',
  itens: [
      {
        nome: 'medicamento',
        label: 'Medicamento',
        type: 'text',
        value: '',
        erro: '',
        bloqueado: false,
      },
      {
        nome: 'dosagem',
        label: 'Dosagem',
        type: 'text',
        value: '',
        erro: '',
        bloqueado: false,
      },
      {
        nome: 'horario',
        label: 'Horario',
        type: 'text',
        value: '',
        erro: '',
        bloqueado: false,
      },
      {
        nome: 'duracao',
        label: 'Duracao',
        type: 'text',
        value: '',
        erro: '',
        bloqueado: false,
      },
  ]
}

export const enviarExame = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeExameStore = useSaudeExameStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = criarFormData([formulario])

  try {
      await saudeExameStore.fetchExameCadastrar(id, json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Exame cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar exame!')
      throw e
  }

}
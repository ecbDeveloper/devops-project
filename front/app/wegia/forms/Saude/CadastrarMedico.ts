
export const cadastrarMedico = {
  titulo: '',
  itens: [
      {
        nome: 'nome',
        label: 'Medico',
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
        bloqueado: false,
      },
      {
        nome: 'crm',
        label: "CRM",
        placeholder: '1234567-rj',
        type: 'text',
        value: '',
        erro: '',
        max: 10,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
        bloqueado: false
      }
  ]
}

export const enviarMedico = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeMedicoStore = useSaudeMedicoStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario])

  const existeCRM = saudeMedicoStore.existeCRM(json.crm)
  const crmField = formulario.itens.find(f => f.nome === 'crm');

  if(existeCRM && crmField) {
    crmField.erro = 'CRM ja cadastrado'
    return
  }

  try {
      await saudeMedicoStore.fetchCadastrarMedico(json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Medico cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar exame!')
      throw e
  }

}
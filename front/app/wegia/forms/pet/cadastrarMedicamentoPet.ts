export const cadastrarMedicamentoPet = {
    titulo: 'Cadastrar Medicamento',
    itens: [
      {
        nome: 'nome_medicamento',
        label: 'Nome',
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'aplicacao',
        label: 'Aplicação',
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'descricao_medicamento',
        label: 'Descrição do medicamento',
        type: 'textarea',
        value: '',
        erro: '',
        validacao: undefined,
        obrigatorio: false
      }
    ]
}

export const enviarMedicamento = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {
    const medicamentoStore = usePetMedicamentoStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])

    if(!validacao) return {status: 422, json: {}}

    const formData = criarFormData([formulario])
    const json = formDataParaJson(formData) as PetMedicamentoCadastrarInterface

    try {
        await medicamentoStore.fetchCriarMedicamento(json)
        limparCampos([formulario])

        alertStore.mostrarAlerta('success', 'Medicamento cadastrado com sucesso!')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao cadastrar Medicamento!')
        throw e
    }
}

export const atualizarMedicamento = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const medicamentoStore = usePetMedicamentoStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const formData = criarFormData([formulario])
  const json = formDataParaJson(formData) as Partial<PetMedicamentoCadastrarInterface>

  try {
      await medicamentoStore.fetchAtualizarMedicamento(json, id)

      alertStore.mostrarAlerta('success', 'Medicamento atualizado com sucesso!')
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao atualizar Medicamento!')
      throw e
  }
}

export const cadastrarFichaPet =  {
    titulo: 'Ficha Medica',
    itens: [
      {
        nome: 'castrado',
        label: 'Animal Castrado?',
        type: 'radio',
        value: '',
        erro: '',
        opcoes: [
          { value: 's', texto: 'Sim' },
          { value: 'n', texto: 'Não' }
        ],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'necessidades_especiais',
        label: 'Observações',
        type: 'textarea',
        value: '',
        erro: '',
        obrigatorio: false
      }
    ]
}

export const enviarFichaMedica = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
  id: number,
) => {

    const fichaMedicaStore = useFichaMedicaStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])

    if(!validacao) return {status: 422, json: {}}

    const formData = criarFormData([formulario])
    const json = formDataParaJson(formData) as FichaMedicaCadastrarInterface

    try {
        await fichaMedicaStore.fetchCriarFichaMedica(id, json)

        alertStore.mostrarAlerta('success', 'Ficha Medica cadastrada com sucesso!')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao cadastrar Ficha Medica!')
        throw e
    }
}

export const atualizarFichaMedica = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
  id: number,
) => {

    const fichaMedicaStore = useFichaMedicaStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])

    if(!validacao) return {status: 422, json: {}}

    const formData = criarFormData([formulario])
    const json = formDataParaJson(formData) as FichaMedicaCadastrarInterface

    try {
        await fichaMedicaStore.fetchAtualizarFichaMedica(id, json)

        alertStore.mostrarAlerta('success', 'Ficha Medica atualizada com sucesso!')
    } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao atualizar Ficha Medica!')
      throw e
    }
}
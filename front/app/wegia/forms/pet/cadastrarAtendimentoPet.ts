export const cadastrarAtendimentoPet =  {
  titulo: 'Atendimento',
  itens: [
    {
      nome: 'data_atendimento',
      label: "Data do Atendimento",
      placeholder: 'DD/mm/aaaa',
      type: 'text',
      value: '',
      erro: '',
      regex: /\D/g,
      mask: '##/##/####',
      formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
      validacao: ValidateForm.dataMenorQueHoje,
      bloqueado: false,
      obrigatorio: true
    },
    {
      nome: 'descricao',
      label: 'Descrição do atendimento',
      type: 'textarea',
      value: '',
      erro: '',
      obrigatorio: true
    },
    {
      nome: 'medicamentos',
      label: "Medicamento",
      type: 'selectMultiple',
      storeOpcoes: {
          store: usePetMedicamentoStore,
          action: 'fetchMedicamentosParaFiltro',
          stateProp: 'getMedicamentosParaFiltrosParaSelect',
      },
      opcoes: [],
      value: [''],
      erro: '',
      validacao: ValidateForm.obrigatorio,
      bloqueado: false,
      obrigatorio: true
  },
  ]
}

export const enviarAtendimento = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
  id: number,
) => {

  const fichaMedicaStore = useFichaMedicaStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const json = formatFormToJson([formulario]) as PetAtendimentoCadastrarInterface

  try {
      await fichaMedicaStore.fetchCriarAtendimento(id, json)
      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Atendimento cadastrado com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar Ficha Medica!')
      return {status: 500, json: {}}
  }
}
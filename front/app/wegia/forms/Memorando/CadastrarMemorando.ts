import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const cadastrarMemorando = {
  titulo: '',
  itens: [
      {
        nome: 'id_destinatario',
        label: "Destino",
        type: 'autoComplete',
        storeOpcoes: {
          store: useFuncionarioStore,
          stateProp: 'getFuncionariosAutoComplete'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
          nome: 'titulo',
          label: "Titulo",
          type: 'text',
          value: '',
          erro: '',
          validacao: ValidateForm.obrigatorio,
          obrigatorio: true
      },
      {
        nome: 'anexos',
        label: "Arquivos",
        type: 'multipleFile',
        value: [],
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'texto',
        label: "Despacho",
        type: 'textarea',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
  ]
}


export const enviarCadastarMemorando = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const memorandoStore = useMemorandoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const formData = criarFormData([formulario])

  try {
    await memorandoStore.fetchCadastrarMemorando(formData)
  } catch (e) {
    throw e
  }
}
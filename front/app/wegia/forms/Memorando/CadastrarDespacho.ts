import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const cadastrarDespacho = {
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


export const enviarCadastrarDespacho = async (formulario: { titulo: string; itens: FormularioInterface[] }, id: number) => {

  const despachoStore = useDespachoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const formData = criarFormData([formulario])

  try {
    await despachoStore.fetchCadastrarDespacho(formData, id)
  } catch (e) {
    throw e
  }
}
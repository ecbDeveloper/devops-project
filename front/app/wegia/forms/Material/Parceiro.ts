import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const cadastrarParceiro = {
  titulo: '',
  itens: [
      {
        nome: 'nome',
        label: "Nome",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'cpf',
        label: "CPF",
        type: 'text',
        placeholder: "Ex. 000.000.000-00",
        mask: "###.###.###-##",
        value: '',
        erro: '',
        regex: /\D/g,
        formatarParaEnviar: [/\D/g, ''],
        formatarParaAdicionarNoForm: FormatarParaForm.formatarCpf,
        validacao: ValidateForm.cpfValidacao
      },
      {
        nome: 'cnpj',
        label: "CNPJ",
        type: 'text',
        placeholder: "Ex. 00.000.000/0000-00",
        mask: "##.###.###/####-##",
        value: '',
        erro: '',
        regex: /\D/g,
        formatarParaEnviar: [/\D/g, ''],
        formatarParaAdicionarNoForm: FormatarParaForm.formatarCnpj,
        validacao: ValidateForm.cnpjValidacao
      },
      {
        nome: 'telefone',
        label: "Telefone",
        type: 'text',
        placeholder: "Ex. (00) 00000-0000",
        mask: "(##) #####-####",
        value: '',
        erro: '',
        regex: /\D/g,
        formatarParaEnviar: [/\D/g, ''],
        formatarParaAdicionarNoForm: FormatarParaForm.formatarTelefone
      }
  ]
}

export const enviarParceiro = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const materialParceiroStore = useMaterialParceiroStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([formulario])

  if(!data.cpf.length && !data.cnpj.length) {
    alertStore.mostrarAlerta('error', 'Adicione pelo menos o cpf ou o cpnj!')
    return {status: 422, json: {}}
  }

  try {
    await materialParceiroStore.fetchCadastrarParceiro(data)

  } catch (e) {
    throw e as FetchError<ErroApiInterface>
  }
}

export const enviarAtualizarParceiro = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] }
) => {

  const materialParceiroStore = useMaterialParceiroStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([formulario])

  if(!data.cpf.length && !data.cnpj.length) {
    alertStore.mostrarAlerta('error', 'Adicione pelo menos o cpf ou o cpnj!')
    return {status: 422, json: {}}
  }

  try {
    await materialParceiroStore.fetchAtualizarParceiro(id, data)

  } catch (e) {
    throw e as FetchError<ErroApiInterface>
  }
}

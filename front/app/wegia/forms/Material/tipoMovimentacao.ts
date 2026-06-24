import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'
import type { FetchError } from 'ofetch'

export const cadastrarTipoMovimentacao = {
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
        nome: 'tipo',
        label: "Tipo",
        type: 'select',
        opcoes: [
          { value: TipoMovimentacaoEnum.ENTRADA, texto: 'Entrada'},
          { value: TipoMovimentacaoEnum.SAIDA, texto: 'Saída'}
        ],
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
        desabilitado: false
      },
  ]
}

export const enviarTipoMovimentacao = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const materialTipoMovimentacaoStore = useMaterialTipoMovimentacaoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([formulario])

  try {
    await materialTipoMovimentacaoStore.fetchCadastrarTipoMovimentacao(data)

  } catch (e) {
    throw e as FetchError<ErroApiInterface>
  }
}

export const enviarAtualizacaoTipoMovimentacao = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] }
) => {

  const materialTipoMovimentacaoStore = useMaterialTipoMovimentacaoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const data = formatFormToJson([formulario])

  try {
    await materialTipoMovimentacaoStore.fetchAtualizarTipoMovimentacao(id, data)

  } catch (e) {
    throw e as FetchError<ErroApiInterface>
  }
}


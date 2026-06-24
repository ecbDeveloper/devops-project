import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'

export interface MaterialTransacaoBuscarPaginadoParamsInterface {
  buscar: string
  tipo: TipoMovimentacaoEnum
  ordenacao: string
  tipoOrdenacao: string
  pagina: string
  itensPorPagina: string
}
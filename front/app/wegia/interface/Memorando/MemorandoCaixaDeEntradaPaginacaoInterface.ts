import type {MemorandoCaixaDeEntradaInterface} from './MemorandoCaixaDeEntradaInterface'

export interface MemorandoCaixaDeEntradaPaginacaoInterface {
  items: MemorandoCaixaDeEntradaInterface[]
  paginaAtual: number
  totalPaginas: number
  totalItens: number
  itensPorPagina: number
}
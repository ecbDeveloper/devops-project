export interface PaginacaoInterface<T = any> {
  items: T[];
  paginaAtual: number
  totalPaginas: number
  totalItens: number
  itensPorPagina: number
}
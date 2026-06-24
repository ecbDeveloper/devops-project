export interface SaudeFichaMedicaPaginacaoInterface {
  items: SaudeFichaMedicaInterface[]
  paginaAtual: number
  totalPaginas: number
  totalItens: number
  itensPorPagina: number
}
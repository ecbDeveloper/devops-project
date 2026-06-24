import type { AvisoInterface } from './AvisoInterface'

export interface AvisoPaginacaoInterface {
  items: AvisoInterface[],
  itensPorPagina: number;
  paginaAtual: number;
  totalItens: number;
  totalPaginas: number;
}
export interface PetAtendimentoPaginacaoInterface {
  items: PetAtendimentoInterface[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  itensPorPagina: number;
}

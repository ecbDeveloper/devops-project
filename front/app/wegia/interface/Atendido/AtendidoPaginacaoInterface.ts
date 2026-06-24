import type { AtendidoInterface } from "./AtendidoInterface";

export interface AtendidoPaginacaoInterface {
    items: AtendidoInterface[],
    paginaAtual: number,
    totalPaginas: number,
    totalItens: number,
    itensPorPagina: number
}
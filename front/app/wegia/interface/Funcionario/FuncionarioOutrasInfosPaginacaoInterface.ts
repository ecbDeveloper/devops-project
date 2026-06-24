import type { FuncionarioOutrasInfosInterface } from "./FuncionarioOutrasInfosInterface";

export interface FuncionarioOutrasInfosPaginacaoInterface {
    items: FuncionarioOutrasInfosInterface[],
    itensPorPagina: number;
    paginaAtual: number;
    totalItens: number;
    totalPaginas: number;
}
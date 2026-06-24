import type { FuncionarioInterface } from "./FuncionarioInterface";

export interface FuncionarioPaginacaoInterface {
    items: FuncionarioInterface[];
    itensPorPagina: number;
    paginaAtual: number;
    totalItens: number;
    totalPaginas: number;
}
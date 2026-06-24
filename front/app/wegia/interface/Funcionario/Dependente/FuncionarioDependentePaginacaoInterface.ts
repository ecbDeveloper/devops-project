import type { FuncionarioDependenteInterface } from "./FuncionarioDependenteInterface";

export interface FuncionarioDependentePaginacaoInterface {
    items: FuncionarioDependenteInterface[]
    paginaAtual: number
    totalPaginas: number
    totalItens: number
    itensPorPagina: number
}
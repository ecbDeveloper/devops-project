import type { FuncionarioRemuneracaoInterface } from "./FuncionarioRemuneracaoInterface";

export interface FuncionarioRemuneracaoPaginacaoInterface {
    items: FuncionarioRemuneracaoInterface[]
    paginaAtual: number
    totalPaginas: number
    totalItens: number
    itensPorPagina: number
}
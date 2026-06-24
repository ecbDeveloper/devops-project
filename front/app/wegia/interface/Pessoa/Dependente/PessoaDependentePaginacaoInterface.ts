import type { PessoaDependenteInterface } from "./PessoaDependenteInterface"

export interface PessoaDependentePaginacaoInterface {
    items: PessoaDependenteInterface[]
    paginaAtual: number
    totalPaginas: number
    totalItens: number
    itensPorPagina: number
}
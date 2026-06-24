import type { FuncionarioDocumentoInterface } from "./FuncionarioDocumentoInterface";

export interface FuncionarioDocumentoPaginacaoInterface {
    items: FuncionarioDocumentoInterface[]
    paginaAtual: number
    totalPaginas: number
    totalItens: number
    itensPorPagina: number
}
import type { AtendidoOcorrenciaInterface } from "./AtendidoOcorrenciaInterface";

export interface AtendidoOcorrenciaPaginacaoInterface {
    items: AtendidoOcorrenciaInterface[],
    paginaAtual: number,
    totalPaginas: number,
    totalItens: number,
    itensPorPagina: number
}
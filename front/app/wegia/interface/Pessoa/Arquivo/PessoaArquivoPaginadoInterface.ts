export interface PessoaArquivoPaginadoInterface {
    items: PessoaArquivoInterface[]
    paginaAtual: number
    totalPaginas: number
    totalItens: number
    itensPorPagina: number
}
import type { PetInterface } from "./PetInterface";

export interface PetPaginacaoInterface {
    items: PetInterface[];
    paginaAtual: number;
    totalPaginas: number;
    totalItens: number;
    itensPorPagina: number;
}

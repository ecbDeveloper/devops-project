import type { FuncionarioListaInfoInterface } from "./FuncionarioListaInfoInterface";

export interface FuncionarioOutrasInfosInterface {
    idfunncionario_outrasinfo: number,
    funcionario_id_funcionario: number,
    lista_info: FuncionarioListaInfoInterface,
    dado: string
}
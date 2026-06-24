import type { FuncionarioRemuneracaoTipoInterface } from "./FuncionarioRemuneracaoTipoInterface";

export interface FuncionarioRemuneracaoInterface {
    idfuncionario_remuneracao: number,
    funcionario_id_funcionario: number,
    valor: number,
    inicio: string,
    fim: string,
    tipo: FuncionarioRemuneracaoTipoInterface
}
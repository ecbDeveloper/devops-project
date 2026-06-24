import type { PessoaInterface } from "~/interface/Pessoa/PessoaInterface"
import type { FuncionarioInterface } from "../FuncionarioInterface"
import type { FuncionarioDependenteParentescoInterface } from "./FuncionarioDependenteParentescoInterface"

export interface FuncionarioDependenteInterface {
    id_dependente: number,
    id_funcionario: number,
    id_parentesco: number,
    id_pessoa: number,
    pessoa: PessoaInterface | null,
    funcionario: FuncionarioInterface | null,
    parentesco: FuncionarioDependenteParentescoInterface | null
}
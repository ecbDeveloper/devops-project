import type { PessoaInterface } from "../PessoaInterface"

export interface PessoaDependenteInterface {
    id_dependente: number
    id_dependente_pessoa: number
    id_pessoa: number
    parentesco: String
    titular: PessoaInterface | null
    dependente: PessoaInterface | null
}
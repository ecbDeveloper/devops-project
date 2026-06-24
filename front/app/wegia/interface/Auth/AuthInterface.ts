import type { PessoaInterface } from "../Pessoa/PessoaInterface"
import type { AuthTokenInterface } from "./AuthTokenInterface"

export interface AuthInterface {
    data: {
        token: AuthTokenInterface
        pessoa: PessoaInterface
    }
}
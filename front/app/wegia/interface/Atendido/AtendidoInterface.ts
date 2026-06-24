import type { PessoaInterface } from "../Pessoa/PessoaInterface";
import type { AtendidoStatusInterface } from "./AtendidoStatusInterface";
import type { AtendidoTipoInterface } from "./AtendidoTipoInterface";

export interface AtendidoInterface {
    idatendido: number,
    pessoa_id_pessoa: number,
    atendido_tipo_idatendido_tipo: number,
    atendido_status_idatendido_status: number,
    pessoa: PessoaInterface | null,
    tipo: AtendidoTipoInterface | null,
    status: AtendidoStatusInterface | null,
}
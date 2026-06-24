import type { AtendidoOcorrenciaTipoInterface } from "./AtendidoOcorrenciaTipoInterface";

export interface AtendidoOcorrenciaInterface {
    idatendido_ocorrencias: number,
    atendido_idatendido: number,
    atendido_ocorrencia_tipos_idatendido_ocorrencia_tipos: number,
    funcionario_id_funcionario: number,
    data: string,
    descricao: string,
    documento: AtendidoOcorrenciaDocumentoInterface | null
    atendido: AtendidoInterface | null
    funcionario: FuncionarioInterface | null
    tipo: AtendidoOcorrenciaTipoInterface | null
}
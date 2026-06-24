import type { FuncionarioQuadroHorarioEscalaInterface } from "../FuncionarioQuadroHorarioEscalaInterface";
import type { FuncionarioQuadroHorarioTipoInterface } from "../FuncionarioQuadroHorarioTipoInterface";

export interface FuncionarioCargaHorariaInterface {
    id_quadro_horario: number;
    id_funcionario: number;
    id_tipo: number | null;
    id_escala: number | null;
    carga_horaria: string;
    entrada1: string;
    saida1: string;
    entrada2: string;
    saida2: string;
    total: string;
    dias_trabalhados: string;
    folga: string;
    escala: FuncionarioQuadroHorarioEscalaInterface;
    tipo: FuncionarioQuadroHorarioTipoInterface;
}
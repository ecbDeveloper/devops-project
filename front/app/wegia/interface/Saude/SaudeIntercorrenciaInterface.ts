export interface SaudeIntercorrenciaInterface {
  id_intercorrencia: number
  id_funcionario: number
  id_fichamedica: number
  data: string
  descricao: string
  funcionario: FuncionarioInterface | null
}
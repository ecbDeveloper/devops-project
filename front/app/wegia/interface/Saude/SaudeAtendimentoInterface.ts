export interface SaudeAtendimentoInterface {
  id_atendimento: number
  id_fichamedica: number
  id_funcionario: number
  id_medico: number
  data_registro: string
  data_atendimento: string
  descricao: string
  medicacoes: SaudeMedicacaoInterface[]
  medico: SaudeMedicoInterface
  funcionario: FuncionarioInterface
}
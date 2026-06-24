export interface SaudeAtendimentoCadastrarInterface {
  id_funcionario: number
  id_medico: number
  data_atendimento: string
  descricao: string
  medicacoes: SaudeMedicacaoCadastrarInterface[] | null
}
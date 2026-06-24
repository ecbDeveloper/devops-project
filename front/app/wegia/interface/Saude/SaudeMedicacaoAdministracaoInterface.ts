export interface SaudeMedicacaoAdministracaoInterface {
  idsaude_medicamento_administracao: number
  aplicacao: string
  saude_medicacao_id_medicacao: number
  funcionario_id_funcionario: number
  funcionario: FuncionarioInterface | null
}
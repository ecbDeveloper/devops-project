export interface SaudeMedicacaoInterface {
  id_medicacao: number
  id_atendimento: number
  medicamento: string
  dosagem: string
  horario: string
  duracao: string
  status: string
  administracao: SaudeMedicacaoAdministracaoInterface[] | null
}
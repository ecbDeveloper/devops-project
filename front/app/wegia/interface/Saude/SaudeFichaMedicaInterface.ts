export interface SaudeFichaMedicaInterface {
  id_fichamedica: number
  id_pessoa: number
  prontuario: string
  pessoa: PessoaInterface
  historico: SaudeProntuarioHistoricoInterface[] | null
}
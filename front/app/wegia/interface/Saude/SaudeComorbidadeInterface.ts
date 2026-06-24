export interface SaudeComorbidadeInterface {
  id_enfermidade: number
  id_fichamedica: number
  id_CID: number
  data_diagnostico: string
  status: number
  cid: SaudeCIDInterface | null
}
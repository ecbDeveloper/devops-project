export interface SaudeFichaMedicaAlergiaInterface {
  id_fichamedica_alergia: number
  id_fichamedica: number
  id_alergia: number
  alergias: SaudeAlergiaInterface | null
}
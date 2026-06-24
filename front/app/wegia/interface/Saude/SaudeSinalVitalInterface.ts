export interface SaudeSinalVitalInterface {
  id_sinais_vitais: number
  id_fichamedica: number
  id_funcionario: number
  data: string
  saturacao: number
  pressao_arterial: string
  frequencia_cardiaca: number
  frequencia_respiratoria: number
  temperatura: number
  hgt: string
  funcionario: FuncionarioInterface | null
}
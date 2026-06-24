export interface SaudeExameInterface {
  id_exame: number
  id_fichamedica: number
  id_exame_tipo: number
  data: string
  arquivo_nome: string
  arquivo_extensao: string
  arquivo: string
  tipo: SaudeExameTipoInterface | null
}
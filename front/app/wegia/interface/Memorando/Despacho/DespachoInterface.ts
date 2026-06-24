import type { AnexoInterface } from '../Anexo/AnexoInterface'

export interface DespachoInterface {
  id_despacho: number
  id_memorando: number
  id_remetente: number
  id_destinatario: number
  texto: string
  data: string
  anexos: AnexoInterface[]
  remetente: string
  destinatario: string
}
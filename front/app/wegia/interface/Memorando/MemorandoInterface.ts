import type { DespachoInterface } from './Despacho/DespachoInterface'

export interface MemorandoInterface {
  id_memorando: number,
  id_pessoa: number
  titulo: string
  data: string
  status_memorando: string
  despachos: DespachoInterface[]
}
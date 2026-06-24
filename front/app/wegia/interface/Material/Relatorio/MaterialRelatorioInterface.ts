export interface MaterialRelatorioInterface {
  id_transacao: number
  id_tipo_movimentacao: number
  id_responsavel: number
  id_parceiro: number
  id_almoxarifado: number
  id_produto: number
  tipo_movimentacao: string
  tipo: string
  almoxarifado: string
  produto: string
  unidade: string
  quantidade_total: number
  valor_total: number
  valor_unitario: number
  parceiro: string
  responsavel: string
  data: string
}
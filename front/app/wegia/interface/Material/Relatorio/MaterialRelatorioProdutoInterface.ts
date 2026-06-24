export interface MaterialRelatorioProdutoInterface {
  id_transacao: number
  id_tipo_movimentacao: number
  id_responsavel: number
  id_almoxarifado: number
  id_produto: number
  id_parceiro: number
  data: string
  tipo_movimentacao: string
  tipo: string
  almoxarifado: string
  parceiro: string
  responsavel: string
  produto: string
  unidade: string
  quantidade: number
  valor_unitario: number
  total: number
}
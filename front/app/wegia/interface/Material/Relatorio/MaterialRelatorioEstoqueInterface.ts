export interface MaterialRelatorioEstoqueInterface {
  id_transacao: number
  id_almoxarifado: number
  id_produto: number
  produto: string
  unidade: string
  quantidade_entradas: number
  quantidade_saidas: number
  quantidade_estoque: number
  total: number
  preco_medio: number
}
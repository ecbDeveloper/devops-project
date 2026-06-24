export interface MaterialTransacaoProdutoInterface {
  id_transacao_produto: number
  id_transacao: number
  id_produto: number
  quantidade: number
  valor_unitario: string
  produto: MaterialProdutoInterface
}
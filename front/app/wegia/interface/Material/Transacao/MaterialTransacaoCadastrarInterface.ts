export interface MaterialTransacaoCadastrarInterface {
  id_tipo_movimentacao: number
  id_almoxarifado: number
  id_parceiro: number
  produtos: {
    id_produto: number
    quantidade: number
    valor_unitario: number
  }[]
}
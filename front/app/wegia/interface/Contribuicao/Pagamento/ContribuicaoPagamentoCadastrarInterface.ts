export interface ContribuicaoPagamentoCadastrarInterface {
  id_socio: number
  id_contribuicao_meioPagamento: number
  valor: number
  parcelas: number
  data_vencimento: number | null
  data_vencimento_completa: string | null
  cartao_hash: string | null
  intervalo: number | null
}
export interface ContribuicaoRegraMeioPagamentoInterface {
  id: number
  id_meioPagamento: number
  id_regra: number
  valor: string
  status: number
  meio_pagamento: ContribuicaoMeioPagamentoInterface,
  regra: ContribuicaoRegraInterface | null
}
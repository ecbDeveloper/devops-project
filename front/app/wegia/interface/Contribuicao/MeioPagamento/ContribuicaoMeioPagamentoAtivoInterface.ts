export interface ContribuicaoMeioPagamentoAtivoInterface {
  id: number
  meio: string
  regras: ContribuicaoRegraMeioPagamentoInterface[]
  gateway: ContribuicaoGatewayInterface
}
export interface ContribuicaoMeioPagamentoInterface {
  id: number
  id_plataforma: number
  meio: string
  status: number
  gateway: ContribuicaoGatewayInterface
}
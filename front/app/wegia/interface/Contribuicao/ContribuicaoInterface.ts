export interface ContribuicaoInterface {
  id: number
  id_socio: number
  id_meio_pagamento: number
  codigo: string
  valor: string
  data_geracao: string
  data_vencimento: string
  data_pagamento: string
  status_pagamento: number
  socio: SocioInterface
  gateway: ContribuicaoGatewayInterface
  meio_pagamento: ContribuicaoMeioPagamentoInterface
}
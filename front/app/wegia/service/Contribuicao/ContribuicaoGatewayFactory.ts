import type { PagamentoGatewayConfigInterface } from "~/interface/Contribuicao/Gateway/PagamentoGatewayConfigInterface";
import type { PagamentoGatewayInterface } from "~/interface/Contribuicao/Gateway/PagamentoGatewayInterface";
import { ContribuicaoGatewayPagarMeService } from "./Gateway/ContribuicaoGatewayPagarMeService";

class ContribuicaoGatewayFactory {
  private gateways: Map<string, PagamentoGatewayInterface> = new Map()

  async realizarPagamento(config: PagamentoGatewayConfigInterface, gateway: string) {

    let gatewayInstance: PagamentoGatewayInterface | null = null

    switch (gateway.toLowerCase()) {
        case 'pagarme':
          gatewayInstance = new ContribuicaoGatewayPagarMeService()
          break
        default:
          throw new Error(`Gateway ${gateway} não suportado`)
    }

    try {
      await gatewayInstance?.inicializarPagamento(config)
      const token = await gatewayInstance?.criarPagamento()
      return token
    } catch (e) {
      throw e;
    }
  }
}

export default new ContribuicaoGatewayFactory()
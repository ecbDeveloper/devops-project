import type { PagamentoGatewayConfigInterface } from "./PagamentoGatewayConfigInterface";

export interface PagamentoGatewayInterface {

  inicializarPagamento(config: PagamentoGatewayConfigInterface): Promise<void>;
  criarPagamento(): Promise<string>;

}
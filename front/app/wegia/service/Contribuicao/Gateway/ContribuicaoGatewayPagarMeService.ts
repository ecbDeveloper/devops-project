import type { PagamentoGatewayConfigInterface } from "~/interface/Contribuicao/Gateway/PagamentoGatewayConfigInterface";
import type { PagamentoGatewayInterface } from "~/interface/Contribuicao/Gateway/PagamentoGatewayInterface";

export class ContribuicaoGatewayPagarMeService implements PagamentoGatewayInterface {

  private config: PagamentoGatewayConfigInterface | null = null
  private publicKey: string =  useRuntimeConfig().public.PUBLIC_KEY_PAGAR_ME;

  async inicializarPagamento(config: PagamentoGatewayConfigInterface): Promise<void> {
    this.config = config;
  }

  async criarPagamento(): Promise<string> {
    const data : any = await useHttpPagarMe(`tokens?appId=${this.publicKey}`, {
      method: 'POST',
      body : JSON.stringify({
        type: "card",
        card: {
          "number": this.config?.numeroCartao.replaceAll(' ', ''),
          "holder_name": this.config?.nomeTitular,
          "exp_month": Number(this.config?.validadeCartao.split('/')[0]),
          "exp_year": Number(this.config?.validadeCartao.split('/')[1]),
          "cvv": this.config?.codigoSeguranca
        }
      })
    })

    return data.id;
  }
}
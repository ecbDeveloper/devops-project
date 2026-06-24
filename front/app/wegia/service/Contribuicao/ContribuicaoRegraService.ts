import BaseService from '../Base/BaseService'

class ContribuicaoRegraService {

  protected baseRoute: string;

  constructor() {
      this.baseRoute = '/contribuicao/regra';
  }

  async criarRegraMeioPagamento(body: ContribuicaoRegraMeioPagamentoCadastrarInterface) {
    return useHttp(`${this.baseRoute}/meio-pagamento`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async listarRegraMeioPagamento(params?: Partial<PaginacaoDefaultParamsInterface>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return await useHttp(`${this.baseRoute}/meio-pagamento${query}`);
  }

  async atualizarRegraMeioPagamento(id: number, body: Partial<ContribuicaoRegraMeioPagamentoCadastrarInterface>) {
      return await useHttp(`${this.baseRoute}/meio-pagamento/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body)
      });
  }

  async filtro() {
    return await useHttp(`${this.baseRoute}/filtro`);
  }

}
export default new ContribuicaoRegraService();

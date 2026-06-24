import BaseService from '../Base/BaseService'

class ContribuicaoMeioPagamentoService  extends BaseService <ContribuicaoMeioPagamentoCadastrarInterface, ContribuicaoMeioPagamentoCadastrarInterface, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/contribuicao/meio-pagamento')
    }

    async filtro() {
      return await useHttp(`${this.baseRoute}/filtro`);
    }

    async ativo() {
      return await useHttp(`${this.baseRoute}/ativos`);
    }

}
export default new ContribuicaoMeioPagamentoService();

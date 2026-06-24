import BaseService from '../Base/BaseService'

class ContribuicaoPagamentoService  extends BaseService <Partial<ContribuicaoPagamentoCadastrarInterface>, any, any> {

    constructor() {
      super('/contribuicao/pagamento')
    }

    sincronizar() {
      return useHttp(`${this.baseRoute}/sincronizar`, {
          method: 'PUT'
      });
    }

}
export default new ContribuicaoPagamentoService();
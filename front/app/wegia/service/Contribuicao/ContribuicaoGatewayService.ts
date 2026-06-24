import BaseService from '../Base/BaseService'

class ContribuicaoGatewayService  extends BaseService <ContribuicaoGatewayCadastrarInterface, ContribuicaoGatewayCadastrarInterface, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/contribuicao/gateway')
    }

    async filtro() {
      return await useHttp(`${this.baseRoute}/filtro`);
    }

}
export default new ContribuicaoGatewayService();

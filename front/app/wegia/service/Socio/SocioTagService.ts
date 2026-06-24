import BaseService from '../Base/BaseService'

class SocioTagService  extends BaseService <SocioTagCadastrarInterface, SocioTagCadastrarInterface, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/socio/tag')
    }

    async filtro() {
      return await useHttp(`${this.baseRoute}/filtro`);
    }

}
export default new SocioTagService();

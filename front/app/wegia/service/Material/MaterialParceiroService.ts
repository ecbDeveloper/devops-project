import BaseService from '../Base/BaseService'

class MaterialParceiroService extends BaseService <MaterialParceiroCadastrarInterface, MaterialParceiroCadastrarInterface, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/material/parceiro')
    }

    async buscarParceiroParaFiltro() {
      return await useHttp(`${this.baseRoute}/filtros`);
    }
}
export default new MaterialParceiroService();

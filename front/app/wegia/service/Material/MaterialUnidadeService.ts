import BaseService from '../Base/BaseService'

class MaterialUnidadeService extends BaseService <MaterialUnidadeCadastrarInterface, MaterialUnidadeCadastrarInterface, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/material/unidade')
    }

    async buscarUnidadeParaFiltro() {
      return await useHttp(`${this.baseRoute}/filtros`);
    }
}
export default new MaterialUnidadeService();

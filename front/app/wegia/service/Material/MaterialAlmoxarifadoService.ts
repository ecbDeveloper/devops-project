import BaseService from '../Base/BaseService'

class MaterialAlmoxarifadoService extends BaseService <MaterialAlmoxarifadoCadastrarInterface, MaterialAlmoxarifadoCadastrarInterface, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/material/almoxarifado')
    }

    async buscarAlmoxarifadoParaFiltro() {
      return await useHttp(`${this.baseRoute}/filtros`);
    }
}
export default new MaterialAlmoxarifadoService();

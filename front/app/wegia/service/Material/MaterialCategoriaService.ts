import BaseService from '../Base/BaseService'

class MaterialCategoriaService extends BaseService <MaterialCategoriaCadastrarInterface, any, any> {

    constructor() {
        super('/material/categoria')
    }

    async buscarCodigoParaFiltro() {
      return await useHttp(`${this.baseRoute}/filtros`);
    }

}
export default new MaterialCategoriaService();

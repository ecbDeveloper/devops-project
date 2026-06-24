import BaseService from '../Base/BaseService'

class MaterialProdutoService extends BaseService <MaterialProdutoCadastrarInterface, MaterialProdutoAtualizarInterface, any> {

    constructor() {
        super('/material/produto')
    }

    async buscarProdutoParaFiltro() {
        return await useHttp(`${this.baseRoute}/filtros`);
    }
}
export default new MaterialProdutoService();

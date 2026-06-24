import BaseService from '../Base/BaseService'

class MaterialRelatorioService extends BaseService <any, any, MaterialRelatorioBuscarTodosParamsInterface> {

    constructor() {
        super('/material/relatorio')
    }

    async listarEstoque(params?: Partial<MaterialRelatorioEstoqueBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/estoque${query}`);
    }

    async listarProduto(params?: Partial<MaterialRelatorioProdutoBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/produto${query}`);
    }

}
export default new MaterialRelatorioService();

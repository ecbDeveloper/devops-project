import BaseService from '../Base/BaseService'

class MaterialTipoMovimentacaoService extends BaseService <TipoMovimentacaoCadastrarInterface, TipoMovimentacaoCadastrarInterface, any> {

    constructor() {
        super('/material/tipo-movimentacao')
    }

    async buscarTipoMovimentacaoParaFiltro(params: Partial<MaterialTipoMovimentacaoParaFiltrosParamsInterface>) {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return await useHttp(`${this.baseRoute}/filtros${query}`);
    }
}
export default new MaterialTipoMovimentacaoService();

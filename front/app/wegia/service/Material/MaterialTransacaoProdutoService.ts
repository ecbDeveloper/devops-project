import BaseService from '../Base/BaseService'

class MaterialTransacaoProdutoService extends BaseService <any, MaterialTransacaoProdutoAtualizarInterface, any> {

    constructor() {
        super('/material/transacao-produto')
    }
}
export default new MaterialTransacaoProdutoService();

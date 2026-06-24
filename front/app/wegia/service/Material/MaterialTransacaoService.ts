import BaseService from '../Base/BaseService'

class MaterialTransacaoService extends BaseService <any, any, any> {

    constructor() {
        super('/material/transacao')
    }

    async buscarResponsaveis() {
        return await useHttp(`${this.baseRoute}/responsavel`);
    }

}
export default new MaterialTransacaoService();

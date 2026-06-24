import BaseService from '../Base/BaseService'

class ConfiguracaoCampoImagemService  extends BaseService <any, any, any> {

    constructor() {
        super('/configuracao/campo-imagem')
    }

}
export default new ConfiguracaoCampoImagemService();

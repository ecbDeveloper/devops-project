import BaseService from '../Base/BaseService'

class ConfiguracaoContatoInstituicaoService  extends BaseService <ConfiguracaoContatoInstituicaoCadastrarInterface, ConfiguracaoContatoInstituicaoCadastrarInterface, any> {

    constructor() {
        super('/configuracao/contato-instituicao')
    }

}
export default new ConfiguracaoContatoInstituicaoService();

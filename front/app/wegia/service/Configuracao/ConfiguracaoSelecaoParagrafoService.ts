import BaseService from '../Base/BaseService'

class ConfiguracaoSelecaoParagrafoService  extends BaseService <any, ConfiguracaoSelecaoParagrafoAtualizarInterface, any> {

    constructor() {
      super('/configuracao/selecao-paragrafo')
    }
}
export default new ConfiguracaoSelecaoParagrafoService();

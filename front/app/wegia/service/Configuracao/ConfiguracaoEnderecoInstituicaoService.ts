import BaseService from '../Base/BaseService'

class ConfiguracaoEnderecoInstituicaoService  extends BaseService <any, any, any> {

    constructor() {
        super('/configuracao/endereco-instituicao')
    }

    atualizarConfiguracao(body: Partial<ConfiguracaoEnderecoInstituicaoAtualizarInterface>) {
      return useHttp(`${this.baseRoute}`, {
          method: 'PUT',
          body: JSON.stringify(body)
      });
    }

}
export default new ConfiguracaoEnderecoInstituicaoService();

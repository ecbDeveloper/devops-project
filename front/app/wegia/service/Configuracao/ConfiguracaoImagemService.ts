import BaseService from '../Base/BaseService'

class ConfiguracaoImagemService  extends BaseService <ConfiguracaoImagemCadastrarInterface | FormData, any, any> {

    constructor() {
        super('/configuracao/imagem')
    }

    async cadastrarImagemNoCampo(id_campo: number, body: ConfiguracaoImagemCampoCadastrarInterface | FormData) {
      const ehFormData = body instanceof FormData

      return await useHttp(`${this.baseRoute}/campo-imagem/${id_campo}`, {
        method: 'POST',
        body: ehFormData ? body : JSON.stringify(body)
      });
    }

    async sincronizarImagemNoCampo(id_imagem: number, id_campo: number, body: ConfiguracaoImagemCampoSincronizarInterface | FormData) {
      const ehFormData = body instanceof FormData

      return await useHttp(`${this.baseRoute}/${id_imagem}/campo-imagem/${id_campo}`, {
        method: 'POST',
        body: ehFormData ? body : JSON.stringify(body)
      });
    }

}
export default new ConfiguracaoImagemService();

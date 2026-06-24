import BaseService from '../Base/BaseService'

class ContribuicaoService  extends BaseService <any, any, SocioControleContribuicaoBuscarTodosParamsInterface> {

    constructor() {
      super('/contribuicao')
    }

    buscarSegundaVia(cpfCnpj: string) {
      return useHttp(`${this.baseRoute}/segunda-via/socio/${cpfCnpj}`);
    }

    enviarComprovanteEmail(body: ContribuicaoEnviarEmailInterface) {

        return useHttp(`${this.baseRoute}/gerar-comprovante/email`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }


}
export default new ContribuicaoService();

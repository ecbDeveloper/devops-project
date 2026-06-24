import BaseService from '../Base/BaseService'

class AtendidoAceitacaoEtapaService  extends BaseService <any, AtendidoAceitacaoEtapaEditarInterface, any> {

    constructor() {
        super('/atendido/aceitacao/etapa')
    }

    cadastrarArquivo(id_etapa: number, body: FormData) {

        return useHttp(`${this.baseRoute}/${id_etapa}/arquivo`, {
            method: 'POST',
            body: body
        });
    }
}
export default new AtendidoAceitacaoEtapaService();

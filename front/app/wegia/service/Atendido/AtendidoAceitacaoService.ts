import BaseService from '../Base/BaseService'

class AtendidoAceitacaoService  extends BaseService <AtendidoAceitacaoCadastrarInterface, any, AtendidoAceitacaoBuscarTodosParamsInterface> {

    constructor() {
        super('/atendido/aceitacao')
    }

    status() {
        return useHttp(`${this.baseRoute}/status`);
    }

    criarEtapa(id_processo: number, body: AtendidoAceitacaoEtapaCadastrarInterface) {
        return useHttp(`${this.baseRoute}/${id_processo}/etapa`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    criarComPessoa(id_pessoa: number) {

        return useHttp(`${this.baseRoute}/pessoa/${id_pessoa}`, {
            method: 'POST'
        });
    }

    cadastrarArquivo(id_processo: number, body: FormData) {

        return useHttp(`${this.baseRoute}/${id_processo}/arquivo`, {
            method: 'POST',
            body: body
        });
    }
}
export default new AtendidoAceitacaoService();

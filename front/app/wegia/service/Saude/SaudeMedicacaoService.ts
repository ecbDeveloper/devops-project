import BaseService from '../Base/BaseService'

class SaudeMedicacaoService extends BaseService <any, SaudeMedicacaoAtualizarInterface, any> {

    constructor() {
        super('/saude/medicacao')
    }

    async buscarAdministracao(id: number, params?: Partial<SaudeMedicacaoAdministracaoBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/aplicacao${query}`);
    }

    async medicacaoAdministracaoCadastrar(id: number, body: SaudeMedicacaoAdministracaoCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/aplicacao`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async medicacaoAdministracaoEmMassaCadastrar(body: SaudeMedicacaoAdministracaoCadastrarEmMassaInterface) {
        return await useHttp(`${this.baseRoute}/aplicacao`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

}
export default new SaudeMedicacaoService();

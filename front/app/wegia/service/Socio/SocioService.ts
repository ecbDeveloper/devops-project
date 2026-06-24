import BaseService from '../Base/BaseService'

class SocioService  extends BaseService <SocioCadastrarInterface, any, PaginacaoDefaultParamsInterface> {

    constructor() {
        super('/socio')
    }

    buscarSociosRelatorio(params?: Partial<SocioRelatorioInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return useHttp(`${this.baseRoute}/relatorio${query}`);
    }

    buscarSociosGraficosTipos() {
        return useHttp(`${this.baseRoute}/tipo/estatistica`);
    }

    buscarSociosAniversariantes(params?: Partial<PaginacaoDefaultParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return useHttp(`${this.baseRoute}/aniversariante${query}`);
    }

    async atualizarSocioPessoa(id: number, id_pessoa: number, body: Partial<SocioAtualizarInterface>) {
        return await useHttp(`/socio/${id}/pessoa/${id_pessoa}`, {
          method: 'PUT',
          body: JSON.stringify(body)
      });
    }

    criarSocioPessoa(body: SocioPessoaCadastrarInterface) {

        return useHttp(`${this.baseRoute}/pessoa`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    buscarSocioPublico(cpfCnpj: string) {
        return useHttp(`${this.baseRoute}/pessoa/${cpfCnpj}`);
    }

}
export default new SocioService();

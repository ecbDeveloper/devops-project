import BaseService from '../Base/BaseService'

class FichaMedicaService  extends BaseService <any, any, any> {

    constructor() {
        super('/pet/ficha-medica')
    }

    async criarAtendimento(id: number, body: PetAtendimentoCadastrarInterface) {
      return await useHttp(`${this.baseRoute}/${id}/atendimento`, {
          method: 'POST',
          body: JSON.stringify(body)
      });
    }

    async buscarAtendimentos(id: number, params: Partial<PetAtendimentoBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';

        return await useHttp(`${this.baseRoute}/${id}/atendimento${query}`);
    }

}
export default new FichaMedicaService();

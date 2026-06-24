import BaseService from '../Base/BaseService'

class PetService  extends BaseService <FormData | any, any, any> {

    constructor() {
        super('/pet')
    }

    async atualizarComFoto(id: number, body: Partial<PetCadastrarInterface>) {
        const ehFormData = body instanceof FormData

        return await useHttp(`${this.baseRoute}/${id}`, {
            method: 'POST',
            body: ehFormData ? body : JSON.stringify(body)
        });
    }

    // Ficha Medica

    async criarFichaMedica(id: number, body: FichaMedicaCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/ficha-medica`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async atualizarFichaMedica(id: number, body: Partial<FichaMedicaCadastrarInterface>) {
        return await useHttp(`${this.baseRoute}/${id}/ficha-medica`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // Adocao

    async criarAdocao(id: number, body: AdocaoCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/adocao`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async atualizarAdocao(id: number, body: Partial<AdocaoCadastrarInterface>) {
        return await useHttp(`${this.baseRoute}/adocao/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }


}
export default new PetService();

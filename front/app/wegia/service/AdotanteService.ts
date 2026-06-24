// services/AdotanteService.ts

class AdotanteService {
    protected baseRoute = '/adotante';

    async criarAdotante(body: any) {
        return await useHttp(`${this.baseRoute}`, {
            method: 'Post',
            body: body
        });
    }

    async getAdotantePorId(id: number) {
        return await useHttp(`${this.baseRoute}/${id}`);
    }

    async listarAdotantes() {
        return await useHttp(`${this.baseRoute}`);
    }

    async atualizarAdotante(body: any, id: number) {
        return await useHttp(`${this.baseRoute}/${id}`, {
            method: 'Put',
            body: body
        });
    }

    async deletarAdotante(id: number) {
        return await useHttp(`${this.baseRoute}/${id}`, {
            method: 'Delete'
        });
    }

    async getAdotantesComPaginacao(params: any) {
        return await useHttp(`${this.baseRoute}?${params}`, {
            method: 'Get',
        });
    }
}

export default new AdotanteService();

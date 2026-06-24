class AtendidoService {

    protected baseRoute = '/atendido'

    async cadastrarAtendido(body: any) {
        return await useHttp(`${this.baseRoute}`, {
            method: 'POST',
            body: body,
        });
    }

    async buscarAtendidos(params: any) {
        return await useHttp(`${this.baseRoute}?${params}`, {
            method: 'GET',
        });
    }

    async buscarAtendidoId(id: number, withString: string = '') {
        return await useHttp(`${this.baseRoute}/${id}?with=${withString}`, {
            method: 'GET',
        });
    }

    async atualizarAtendido(id: number, body: Partial<AtendidoAtualizarInterface>) {
        return await useHttp(`${this.baseRoute}/${id}`, {
            method: 'PUT',
            body: body,
        });
    }


    async buscarStatus() {
        return await useHttp(`${this.baseRoute}/status`, {
            method: 'GET',
        });
    }

    async buscarTipo() {
        return await useHttp(`${this.baseRoute}/tipo`, {
            method: 'GET',
        });
    }

    //Ocorrencias

    async buscarOcorrencias(id: number, params: any = '') {
        return await useHttp(`${this.baseRoute}/${id}/ocorrencia?${params}`, {
            method: 'GET',
        });
    }

    async cadastrarOcorrencia(body: any, id: number) {
        return await useHttp(`${this.baseRoute}/${id}/ocorrencia`, {
            method: 'POST',
            body: body,
        });
    }

    async buscarOcorrenciaTipos() {
        return await useHttp(`${this.baseRoute}/ocorrencia/tipos`, {
            method: 'GET',
        });
    }
}

export default new AtendidoService()
class SituacaoService {

    protected baseRoute = '/situacao'

    async getSituacao() {
        return await useHttp(`${this.baseRoute}`);
    }

    async postSituacao(body: object) {
        return await useHttp(`${this.baseRoute}`, {
            method: 'POST',
            body: body
        });
    }

}

export default new SituacaoService()
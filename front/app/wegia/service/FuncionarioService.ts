class FuncionarioService {

    protected baseRoute = '/funcionario'

    cadastrarFuncionario(body: object | FormData) {
        const ehFormData = body instanceof FormData

        return useHttp(`${this.baseRoute}`, {
            method: 'POST',
            body: ehFormData ? body : JSON.stringify(body)
        });
    }

    async buscarTodosFuncionarios(queryString = {}) {
        return await useHttp(`${this.baseRoute}/todos?${queryString}`);
    }

    async buscarFuncionarios(queryString = {}) {
        return await useHttp(`${this.baseRoute}?${queryString}`);
    }

    async buscarFuncionario(id: number) {
        return await useHttp(`${this.baseRoute}/${id}`);
    }

    async atualizarFuncionario(body: JSON, id_funcionario:number) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}`, {
            method: 'Put',
            body: body
        });
    }

    async getQuadroHorarioEscala() {
        return await useHttp(`${this.baseRoute}/quadro-horario/escala`);
    }

    async getQuadroHorarioTipo() {
        return await useHttp(`${this.baseRoute}/quadro-horario/tipo`);
    }

    async buscarOutrasInformacoes(params = {}, id_funcionario: number) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/outra-info?${params}`);
    }

    async cadastrarOutrasInformacoes(id_funcionario:number, id_funcionario_lista_info: number, body: {dado: string}) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/outra-info/${id_funcionario_lista_info}`, {
            method: 'Post',
            body: body
        });
    }

    async deletarOutraInfo(id: number) {
        return await useHttp(`${this.baseRoute}/outra-info/${id}`, {
            method: 'Delete'
        })
    }

    async buscarListaInfos() {
        return await useHttp(`${this.baseRoute}/lista-info`);
    }

    async cadastrarListaInfos(body: {descricao: String}) {
        return await useHttp(`${this.baseRoute}/lista-info`, {
            method: 'Post',
            body: body
        });
    }

    // Remuneracao

    async buscarRemuneracao(id_funcionario: number, params = {}) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/remuneracao?${params}`);
    }

    async cadastrarRemuneracao(body) {
        return await useHttp(`${this.baseRoute}/remuneracao`, {
            method: 'Post',
            body: body
        });
    }

    async deletarRemuneracao(id_remuneracao: number) {
        return await useHttp(`${this.baseRoute}/remuneracao/${id_remuneracao}`, {
            method: 'Delete'
        });
    }

    async buscarRemuneracaoTotal(id_funcionario: number) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/remuneracao/total`);
    }

    async buscarTipoRemuneracao() {
        return await useHttp(`${this.baseRoute}/remuneracao/tipo`)
    }

    async cadastrarTipoRemuneracao(body: {descricao: string}) {
        return await useHttp(`${this.baseRoute}/remuneracao/tipo`, {
            method: 'Post',
            body: body
        })
    }

    // Documentos

    async buscarDocumentos(id_funcionario: number, params = {}) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/documento?${params}`)
    }

    async cadastrarDocumento(body: {arquivo: File, id_docfuncional: number}, id_funcionario: number) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/documento`, {
            method: 'Post',
            body: body
        })
    }

    async deletarDocumento(id_documento: number){
        return await useHttp(`${this.baseRoute}/documento/${id_documento}`, {
            method: 'Delete'
        })
    }

    async buscarTipoDocumentos () {
        return await useHttp(`${this.baseRoute}/documento/tipo`)
    }

    async cadastrarTipoDocumento(body: {nome_docfuncional: string, descricao_docfuncional: string | null}) {
        return await useHttp(`${this.baseRoute}/documento/tipo`, {
            method: 'Post',
            body: body
        })
    }

    // Carga Horaria

    async buscarCargaHoraria(id_funcionario: number) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/quadro-horario`)
    }

    async cadastrarCargaHoraria(body, id_funcionario: number) {
        return await useHttp(`${this.baseRoute}/${id_funcionario}/quadro-horario`, {
            method: 'Post',
            body: body
        })
    }

    // Dependentes

    async buscarDependentes(id_pessoa: number, params = {}) {
        return await useHttp(`${this.baseRoute}/${id_pessoa}/dependente?${params}`)
    }

    async cadastrarDependentes(body) {
        return await useHttp(`${this.baseRoute}/dependente`, {
            method: 'Post',
            body: body
        })
    }

    async deletarDependentes(id_dependente: number) {
        return await useHttp(`${this.baseRoute}/dependente/${id_dependente}`, {
            method: 'Delete'
        })
    }

    async buscarTiposDependentes() {
        return await useHttp(`${this.baseRoute}/dependente/tipo`)
    }

    async cadastrarTiposDependentes(body: {descricao: string}) {
        return await useHttp(`${this.baseRoute}/dependente/tipo`, {
            method: 'Post',
            body: body
        })
    }

}

export default new FuncionarioService()
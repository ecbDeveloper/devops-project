import type { PessoaAtualizarSenhaInterface } from "~/interface/Pessoa/PessoaAtualizarSenhaInterface"

class PessoaService {

    protected baseRoute = '/pessoa'

    async criarPessoa(body) {
        return await useHttp(`${this.baseRoute}`, {
            method: 'Post',
            body: body
        });
    }

    async getMe(withParam: String = '') {
        return await useHttp(`${this.baseRoute}/logada?with=${withParam}`);
    }

    async getPessoaPorCpf(cpf: string) {
        return await useHttp(`${this.baseRoute}/${cpf}`);
    }

    async getPessoaParaFiltro() {
        return await useHttp(`${this.baseRoute}/filtro`);
    }

    async putPessoa(body, id: number) {
        return await useHttp(`${this.baseRoute}/${id}`, {
            method: 'Put',
            body: body
        });
    }

    async atualizarImagemPessoa(body, id: number) {
        return await useHttp(`${this.baseRoute}/${id}/imagem`, {
            method: 'Post',
            body: body
        });
    }

    async atualizarPropriaSenha(body: PessoaAtualizarSenhaInterface) {
        return await useHttp(`${this.baseRoute}/senha`, {
            method: 'Put',
            body: body
        });
    }

    async atualizarSenhaDeOutraPessoa(id: number, body: PessoaAtualizarSenhaInterface) {
        return await useHttp(`${this.baseRoute}/${id}/senha`, {
            method: 'Put',
            body: body
        });
    }

    // Dependente

    async buscarDependentes(id_pessoa: number, params: string) {
        return await useHttp(`${this.baseRoute}/${id_pessoa}/dependente?${params}`);
    }

    async buscarDependentePorId(id_dependente: number, params: string) {
        return await useHttp(`${this.baseRoute}/dependente/${id_dependente}?${params}`);
    }

    async cadastrarDependente(id_pessoa: number, id_dependente: number, body: any) {
        return await useHttp(`${this.baseRoute}/${id_pessoa}/dependente/${id_dependente}`, {
            method: 'Post',
            body: body
        });
    }

    async deletarDependentes(id_dependente: number) {
        return await useHttp(`${this.baseRoute}/dependente/${id_dependente}`, {
            method: 'Delete'
        });
    }

    // Arquivo

    async buscarArquivo(id_pessoa: number, params: Partial<PessoaArquivoBuscarPaginadoInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id_pessoa}/arquivo${query}`);
    }

    async cadastrarArquivo(id: number, body: FormData) {
        return await useHttp(`${this.baseRoute}/${id}/arquivo`, {
            method: 'Post',
            body: body
        });
    }

    async excluirArquivo(id: number) {
        return await useHttp(`${this.baseRoute}/arquivo/${id}`, {
            method: 'Delete'
        });
    }

    async buscarArquivoTipos() {
        return await useHttp(`${this.baseRoute}/arquivo/tipo`);
    }

    async cadastrarArquivoTipo(body: PessoaTipoArquivoCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/arquivo/tipo`, {
            method: 'Post',
            body: JSON.stringify(body)
        });
    }
}
export default new PessoaService()
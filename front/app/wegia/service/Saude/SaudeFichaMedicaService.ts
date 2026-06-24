import BaseService from '../Base/BaseService'

class SaudeFichaMedicaService  extends BaseService <SaudeFichaMedicaCadastrarInterface, SaudeFichaMedicaAtualizarInterface, SaudeFichaMedicaBuscarTodosParamsInterface> {

    constructor() {
        super('/saude/ficha-medica')
    }

    async adicionarProntuarioHistorico(id: number) {
        return await useHttp(`${this.baseRoute}/${id}/historico`, {
            method: 'POST'
        });
    }

    // Enfermidades

    async buscarEnfermidades(id: number, params: Partial<SaudeComorbidadeBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/enfermidade${query}`);
    }

    async cadastrarEnfermidade(id: number, body: SaudeComorbidadeCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/enfermidade`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async atualizarComorbidade(id: number, body: SaudeComorbidadeCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/enfermidade/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // Exames

    async buscarExames(id: number, params: Partial<SaudeExameBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/exame${query}`);
    }

    async cadastrarExame(id: number, body: FormData) {
        return await useHttp(`${this.baseRoute}/${id}/exame`, {
            method: 'POST',
            body: body
        });
    }

    // Atendimentos

    async buscarAtendimentos(id: number, params: Partial<SaudeAtendimentoBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/atendimento${query}`);
    }

    async cadastrarAtendimento(id: number, body: SaudeAtendimentoCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/atendimento`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    // Medicacao

    async buscarMedicacao(id: number, params: Partial<SaudeMedicacaoBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/medicacao${query}`);
    }

    async atualizarMedicacao(id: number, body: SaudeMedicacaoAtualizarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/medicacao`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    //Sinal Vital

    async buscarSinaisVitais(id: number, params: Partial<SaudeSinalVitalBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/sinal-vital${query}`);
    }

    async cadastrarSinalVital(id: number, body: Partial<SaudeSinalVitalCadastrarInterface>) {
        return await useHttp(`${this.baseRoute}/${id}/sinal-vital`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    // Intercorrencia

    async buscarIntercorrencia(id: number, params: Partial<SaudeIntercorrenciaBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/intercorrencia${query}`);
    }

    async cadastrarIntercorrencia(id: number, body: SaudeIntercorrenciaCadastrarInterface) {
        return await useHttp(`${this.baseRoute}/${id}/intercorrencia`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    // Alergia


    async buscarFichaMedicaAlergias(id: number, params: Partial<SaudeFichaMedicaAlergiaBuscarTodosParamsInterface>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await useHttp(`${this.baseRoute}/${id}/alergia${query}`);
    }

    async cadastrarFichaMedicaAlergias(id: number, id_alergia: number) {
        return await useHttp(`${this.baseRoute}/${id}/alergia/${id_alergia}`, {
            method: 'POST'
        });
    }

    async excluirFichaMedicaAlergias(id: number) {
        return await useHttp(`${this.baseRoute}/alergia/${id}`, {
            method: 'Delete'
        });
    }
}
export default new SaudeFichaMedicaService();


export const useSaudeComorbidadeStore = defineStore('saudeComorbidade', {
    state: () => {
        return {
            comorbidades: {} as PaginacaoInterface<SaudeComorbidadeInterface>,
        }
    },

    getters: {
        getComorbidades: (state) => state.comorbidades,
    },

    actions: {
        async fetchComorbidades(id: number, params: Partial<SaudeComorbidadeBuscarTodosParamsInterface> ) {
                try {
                    const { data } = await SaudeFichaMedicaService.buscarEnfermidades(id, params) as { data:  PaginacaoInterface<SaudeComorbidadeInterface> };
                    this.comorbidades = data;
                } catch (e) {
                    throw e;
                }
        },

        async fetchComorbidadeCadastrar(id: number, json: SaudeComorbidadeCadastrarInterface) {
            try {
                await SaudeFichaMedicaService.cadastrarEnfermidade(id, json)
            } catch (e) {
                throw e;
            }
        },

        async fetchComorbidadeAtualizar(id: number, json: SaudeComorbidadeCadastrarInterface) {
            try {
                await SaudeFichaMedicaService.atualizarComorbidade(id, json)
            } catch (e) {
                throw e;
            }
        }

    },
})

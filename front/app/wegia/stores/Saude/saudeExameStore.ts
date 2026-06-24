
export const useSaudeExameStore = defineStore('saudeExame', {
    state: () => {
        return {
            exames: {} as PaginacaoInterface<SaudeExameInterface>
        }
    },

    getters: {
        getExames: (state) => state.exames,
    },

    actions: {
        async fetchExames(id: number, params: Partial<SaudeExameBuscarTodosParamsInterface> ) {
            try {
                const { data } = await SaudeFichaMedicaService.buscarExames(id, params) as { data: PaginacaoInterface<SaudeExameInterface> };
                this.exames = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchExameCadastrar(id: number, json: FormData) {
            try {
                await SaudeFichaMedicaService.cadastrarExame(id, json)
            } catch (e) {
                throw e;
            }
        },

        async fetchExameDeletar(id: number) {
            try {
                await SaudeExameService.deletar(id)
            } catch (e) {
                throw e;
            }
        }


    },
})

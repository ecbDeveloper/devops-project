
export const useSaudeFichaMedicaStore = defineStore('saudeFichaMedica', {
    state: () => {
        return {
            fichasMedica: {} as SaudeFichaMedicaPaginacaoInterface,
            fichaMedica: {} as SaudeFichaMedicaInterface
        }
    },

    getters: {
        getFichasMedica: (state) => state.fichasMedica,
        getFichaMedica: (state) => state.fichaMedica,
    },

    actions: {
        async fetchFichaMedica(params: Partial<SaudeFichaMedicaBuscarTodosParamsInterface>) {
            try {
                const { data } = await SaudeFichaMedicaService.listar(params) as { data: SaudeFichaMedicaPaginacaoInterface };
                this.fichasMedica = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchFichaMedicaPorId(id: number) {
            try {
                const { data } = await SaudeFichaMedicaService.buscarPorId(id) as { data: SaudeFichaMedicaInterface };
                this.fichaMedica = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchFichaMedicaCadastrar(body: SaudeFichaMedicaCadastrarInterface) {
            try {
                await SaudeFichaMedicaService.criar(body);
            } catch (e) {
                throw e;
            }
        },

        async atualizarProntuario(id: number, body: SaudeFichaMedicaAtualizarInterface) {
            try {
                await SaudeFichaMedicaService.atualizar(id, body);
                this.fichaMedica.prontuario = body.prontuario;
            } catch (e) {
                throw e;
            }
        },

        async adicionarProntuarioHistorico(id: number) {
            try {
                await SaudeFichaMedicaService.adicionarProntuarioHistorico(id);
            } catch (e) {
                throw e;
            }
        }

    },
})

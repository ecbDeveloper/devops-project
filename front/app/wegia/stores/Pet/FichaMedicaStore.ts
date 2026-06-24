export const useFichaMedicaStore = defineStore('fichaMedica', {
    state: () => {
        return {
            atendimentos: {} as PetMedicamentoPaginacaoInterface
        }
    },

    getters: {
        getAtendimentos: (state) => state.atendimentos
    },

    actions: {

        async fetchCriarFichaMedica(id: number, body: FichaMedicaCadastrarInterface) {
            try {
                await PetService.criarFichaMedica(id, body)
            } catch (e) {
                throw e;
            }
        },

        async fetchCriarAtendimento(id: number, body: PetAtendimentoCadastrarInterface) {
            try {
                await FichaMedicaService.criarAtendimento(id, body)
            } catch (e) {
                throw e;
            }
        },

        async fetchBuscarAtendimentos(id: number, params: Partial<PetAtendimentoBuscarTodosParamsInterface>) {
            try {
                const { data } =  await FichaMedicaService.buscarAtendimentos(id, params) as { data: PetMedicamentoPaginacaoInterface }
                this.atendimentos = data
            } catch (e) {
                throw e;
            }
        },

        async fetchAtualizarFichaMedica(id: number, body: Partial<FichaMedicaCadastrarInterface>) {
            try {
                await PetService.atualizarFichaMedica(id, body)
            } catch (e) {
                throw e;
            }
        },

    },
})

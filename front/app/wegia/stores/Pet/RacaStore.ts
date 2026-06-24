
export const useRacaStore = defineStore('raca', {
    state: () => {
        return {
            racas: [] as RacaInterface[],
            modalAberto: false
        }
    },

    getters: {
        getRacas: (state) => state.racas,
        getRacasParaSelect: (state) => state.racas?.map((e: RacaInterface) => {
            return {
                texto: e.descricao,
                value: e.id_pet_raca
            }
        }),
        getModalAberto: (state) => state.modalAberto
    },

    actions: {
        async fetchRacas() {
            try {
                const { data } = await RacaService.listar() as { data: RacaInterface[] };
                this.racas = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchCriarRaca(body: RacaCadastrarInterface) {
            try {
                await RacaService.criar(body)
            } catch (e) {
                throw e;
            }
        },

        setToggleModal() {
            this.modalAberto = !this.modalAberto
        },

        racaExiste(descricao: string): boolean {
            return this.racas.some(e => e.descricao.toLowerCase() === descricao.toLowerCase());
        }

  },
})

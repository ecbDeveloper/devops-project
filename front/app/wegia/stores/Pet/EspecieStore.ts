
export const useEspecieStore = defineStore('especie', {
    state: () => {
        return {
          especies: [] as EspecieInterface[],
          modalAberto: false
        }
    },

    getters: {
        getEspecies: (state) => state.especies,
        getEspeciesParaSelect: (state) => state.especies?.map((e: EspecieInterface) => {
            return {
                texto: e.descricao,
                value: e.id_pet_especie
            }
        }),
        getModalAberto: (state) => state.modalAberto
    },

    actions: {
        async fetchEspecies() {
            try {
                const { data } = await EspecieService.listar() as { data: EspecieInterface[] };
                this.especies = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchCriarEspecie(body: EspecieCadastrarInterface) {
            try {
                await EspecieService.criar(body)
            } catch (e) {
                throw e;
            }
        },

        setToggleModal() {
            this.modalAberto = !this.modalAberto
        },

        especieExiste(descricao: string): boolean {
          return this.especies.some(e => e.descricao.toLowerCase() === descricao.toLowerCase());
        }

    },
})

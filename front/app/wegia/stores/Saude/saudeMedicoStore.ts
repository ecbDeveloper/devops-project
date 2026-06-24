
export const useSaudeMedicoStore = defineStore('saudeMedico', {
    state: () => {
        return {
            medicos: [] as SaudeMedicoInterface[],
            modalAberto: false
        }
    },

    getters: {
        getMedicosParaSelect: (state) => state.medicos.map((medico) => {
            return {
                texto: `${medico.crm} - ${medico.nome}`,
                value: medico.id_medico
            }
          }),
        getModalAberto: (state) => state.modalAberto
    },

    actions: {
        async fetchMedicos() {
            try {
                const { data } = await SaudeMedicoService.listar() as { data: SaudeMedicoInterface[] };
                this.medicos = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchCadastrarMedico(body: SaudeMedicoCadastrarInterface) {
            try {
                await SaudeMedicoService.criar(body)
            } catch (e) {
                throw e;
            }
        },

        setToggleModal() {
            this.modalAberto = !this.modalAberto
        },

        existeCRM(crm: string) {
            return this.medicos.find((medico) => medico.crm.toLowerCase() === crm.toLowerCase())
        }


    },
})

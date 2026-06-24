
export const useSaudeSinalVitalStore = defineStore('sinalVital', {
  state: () => {
      return {
          sinaisVitais: {} as PaginacaoInterface<SaudeSinalVitalInterface>,
          modalAberto: false
      }
  },

  getters: {
      getSinaisVitais: (state) => state.sinaisVitais,
      getModalAberto: (state) => state.modalAberto
  },

  actions: {
      async fetchSinaisVitais(id: number, params: Partial<SaudeSinalVitalBuscarTodosParamsInterface>) {
          try {
              const { data } = await SaudeFichaMedicaService.buscarSinaisVitais(id, params) as { data: PaginacaoInterface<SaudeSinalVitalInterface> };
              this.sinaisVitais = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCadastrarSinalVital(id: number, body: Partial<SaudeSinalVitalCadastrarInterface>) {
          try {
              await SaudeFichaMedicaService.cadastrarSinalVital(id, body)
          } catch (e) {
              throw e;
          }
      },

      setToggleModal() {
          this.modalAberto = !this.modalAberto
      }
  },
})

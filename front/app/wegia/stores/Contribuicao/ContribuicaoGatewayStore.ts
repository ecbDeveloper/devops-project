export const useContribuicaoGatewayStore = defineStore('contribuicaoGatewayStore', {
  state: () => {
    return {
      gatewaysFiltros: [] as ContribuicaoGatewayInterface[]
    }
  },

  getters: {
    getGatewaysFiltros: (state) => state.gatewaysFiltros.map((g) => {
      return  {
        value: g.id,
        texto: g.plataforma
      }
    })
  },

  actions: {
    async fetchGatewaysFiltro() {
      try {
          const { data } = await ContribuicaoGatewayService.filtro() as { data: ContribuicaoGatewayInterface[] };
          this.gatewaysFiltros = data;
      } catch (e) {
          throw e;
      }
    },

  },
})

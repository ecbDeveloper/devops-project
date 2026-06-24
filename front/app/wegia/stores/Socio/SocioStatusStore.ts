export const useSocioStatusStore = defineStore('socioStatusStore', {
  state: () => {
    return {
      status: [] as SocioStatusInterface[]
    }
  },

  getters: {
    getStatusParaFiltro: (state) => state.status.map((g) => {
      return  {
        value: g.id_sociostatus,
        texto: g.status
      }
    })
  },

  actions: {
    async fetchSocioStatus() {
      try {
          const { data } = await SocioStatusService.filtro() as { data: SocioStatusInterface[] };
          this.status = data;
      } catch (e) {
          throw e;
      }
    }
  },
})

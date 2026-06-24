
export const useSaudeCIDStore = defineStore('saudeCID', {
  state: () => {
    return {
        cids: [] as SaudeCIDInterface[],
        modalAberto: false,
    }
  },

  getters: {
    getCidsParaSelect: (state) => state.cids?.map((cid) => {
      return {
          texto: `${cid.CID} - ${cid.descricao}`,
          value: cid.id_CID
      }
    }),
    getModalAberto: (state) => state.modalAberto,
  },

  actions: {
      async fetchCids() {
          try {
              const { data } = await SaudeCIDService.listar() as { data: SaudeCIDInterface[] };
              this.cids = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCidCadastrar(json: SaudeCIDCadastrarInterface) {
        try {
          await SaudeCIDService.criar(json)
        } catch (e) {
            throw e;
        }
      },

      setToggleModal() {
          this.modalAberto = !this.modalAberto;
      }

  },
})

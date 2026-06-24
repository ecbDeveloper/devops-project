export const useMaterialParceiroStore = defineStore('materialParceiro', {
  state: () => {
    return {
      parceiros: {} as PaginacaoInterface<MaterialParceiroInterface>,
      parceiroParaFiltros: [] as MaterialParceiroInterface[],
      modalAberto: false
    }
  },

  getters: {
    getParceiroParaFiltrosParaSelect: (state) => state.parceiroParaFiltros.map(m => ({
      texto: m.nome,
      value: m.id_parceiro
    })),
    getParceiros: state => state.parceiros,
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchParceiroParaFiltros() {
          try {
              const { data } = await MaterialParceiroService.buscarParceiroParaFiltro() as { data: MaterialParceiroInterface[] };
              this.parceiroParaFiltros = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchParceiros(params: Partial<PaginacaoDefaultParamsInterface>) {
        try {
            const { data } = await MaterialParceiroService.listar(params) as { data: PaginacaoInterface<MaterialParceiroInterface> };
            this.parceiros = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchCadastrarParceiro(body: MaterialParceiroCadastrarInterface) {
        try {
          await MaterialParceiroService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizarParceiro(id: number, body: Partial<MaterialParceiroCadastrarInterface>) {
        try {
          await MaterialParceiroService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})

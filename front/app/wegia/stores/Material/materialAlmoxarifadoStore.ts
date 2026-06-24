
export const useMaterialAlmoxarifadoStore = defineStore('materialAlmoxarifado', {
  state: () => {
    return {
      almoxarifados: {} as PaginacaoInterface<MaterialAlmoxarifadoInterface>,
      almoxarifadoParaFiltros: [] as MaterialAlmoxarifadoInterface[],
      modalAberto: false
    }
  },

  getters: {
    getAlmoxarifados: state => state.almoxarifados,
    getAlmoxarifadoParaFiltrosParaSelect: (state) => state.almoxarifadoParaFiltros.map(c => ({
      texto: c.descricao,
      value: c.id_almoxarifado
    })),
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchAlmoxarifados(params: Partial<PaginacaoDefaultParamsInterface>) {
        try {
            const { data } = await MaterialAlmoxarifadoService.listar(params) as { data: PaginacaoInterface<MaterialAlmoxarifadoInterface> };
            this.almoxarifados = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchAlmoxarifadoParaFiltros() {
          try {
              const { data } = await MaterialAlmoxarifadoService.buscarAlmoxarifadoParaFiltro() as { data: MaterialAlmoxarifadoInterface[] };
              this.almoxarifadoParaFiltros = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCadastrarAlmoxafarifado(body: MaterialAlmoxarifadoCadastrarInterface) {
        try {
          await MaterialAlmoxarifadoService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizarAlmoxafarifado(id: number, body: MaterialAlmoxarifadoCadastrarInterface) {
        try {
          await MaterialAlmoxarifadoService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})

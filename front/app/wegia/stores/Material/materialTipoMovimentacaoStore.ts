
export const useMaterialTipoMovimentacaoStore = defineStore('materialTipoMovimentacao', {
  state: () => {
    return {
      tipos: {} as PaginacaoInterface<MaterialTipoMovimentacaoInterface>,
      tipoParaFiltros: [] as MaterialTipoMovimentacaoInterface[],
      tipoDeMovimentacaoFiltros: '' as 's' | 'e',
      modalAberto: false
    }
  },

  getters: {
    getTipoMovimentacaoParaFiltrosParaSelect: (state) => state.tipoParaFiltros.map(m => ({
      texto: m.nome,
      value: m.id_tipo_movimentacao
    })),
    getTipos: state => state.tipos,
    getTipoDeMovimentacaoFiltros: (state) => state.tipoDeMovimentacaoFiltros,
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchTipoMovimentacaoParaFiltros(params: Partial<MaterialTipoMovimentacaoParaFiltrosParamsInterface>) {
          try {
              const { data } = await MaterialTipoMovimentacaoService.buscarTipoMovimentacaoParaFiltro(params) as { data: MaterialTipoMovimentacaoInterface[] };
              this.tipoParaFiltros = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchTipos(params: Partial<PaginacaoDefaultParamsInterface>) {
        try {
            const { data } = await MaterialTipoMovimentacaoService.listar(params) as { data: PaginacaoInterface<MaterialTipoMovimentacaoInterface> };
            this.tipos = data;
        } catch (e) {
            throw e;
        }
    },

      async fetchCadastrarTipoMovimentacao(body: TipoMovimentacaoCadastrarInterface) {
        try {
          await MaterialTipoMovimentacaoService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizarTipoMovimentacao(id: number, body: Partial<TipoMovimentacaoCadastrarInterface>) {
        try {
          await MaterialTipoMovimentacaoService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      },

      setTipoDeMovimentacaoFiltros(tipo: 'e' | 's') {
        this.tipoDeMovimentacaoFiltros = tipo
      }

  },
})

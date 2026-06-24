
export const useMaterialRelatorioStore = defineStore('materialRelatorio', {
  state: () => {
    return {
      relatorio: {} as MaterialRelatorioInterface[],
      estoque:  {} as MaterialRelatorioEstoqueInterface[],
      produto:  {} as MaterialRelatorioProdutoInterface[],
    }
  },

  getters: {
    getRelatorio: state => state.relatorio,
    getProduto: state => state.produto,
    getEstoque: state => state.estoque
  },

  actions: {
      async fetchRelatorio(params: Partial<MaterialRelatorioBuscarTodosParamsInterface>) {
        try {
            const { data } = await MaterialRelatorioService.listar(params) as { data: MaterialRelatorioInterface[] };
            this.relatorio = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchRelatorioEstoque(params: Partial<MaterialRelatorioEstoqueBuscarTodosParamsInterface>) {
        try {
            const { data } = await MaterialRelatorioService.listarEstoque(params) as { data: MaterialRelatorioEstoqueInterface[] };
            this.estoque = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchRelatorioProduto(params: Partial<MaterialRelatorioProdutoBuscarTodosParamsInterface>) {
        try {
            const { data } = await MaterialRelatorioService.listarProduto(params) as { data: MaterialRelatorioProdutoInterface[] };
            this.produto = data;
        } catch (e) {
            throw e;
        }
      },
  },
})

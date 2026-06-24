
export const useMaterialProdutoStore = defineStore('materialProduto', {
  state: () => {
    return {
        produtosParaFiltro: [] as MaterialProdutoInterface[],
        produtosParaFiltroQueForamUsados: [] as Number[],
        produtos: {} as PaginacaoInterface<MaterialProdutoInterface>,
        modalAberto: false
    }
  },

  getters: {
    getProdutoParaFiltrosParaSelect: (state) => {
      return state.produtosParaFiltro
        .filter(p => !state.produtosParaFiltroQueForamUsados.includes(p.id_produto))
        .map(p => ({
          texto: p.descricao,
          value: p.id_produto
        }))
    },
    getProdutos: (state) => state.produtos,
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchProdutos(params: Partial<MaterialProdutobuscarTodosParamsInterface>) {
          try {
              const { data } = await MaterialProdutoService.listar(params) as { data: PaginacaoInterface<MaterialProdutoInterface> };
              this.produtos = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchProdutosParaFiltros() {
        try {
            const { data } = await MaterialProdutoService.buscarProdutoParaFiltro() as { data: MaterialProdutoInterface[] };
            this.produtosParaFiltro = data;
        } catch (e) {
            throw e;
        }
      },


      async fetchCadastrarProduto(body: MaterialProdutoCadastrarInterface) {
        try {
          await MaterialProdutoService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizarProduto(id: number, body: Partial<MaterialProdutoAtualizarInterface>) {
        try {
          await MaterialProdutoService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      },

      setProdutoUsado(id_produto : number) {
        this.produtosParaFiltroQueForamUsados.push(id_produto)
      },

      setRemoverProdutoUsado(id_produto : number) {
        this.produtosParaFiltroQueForamUsados = this.produtosParaFiltroQueForamUsados.filter(
          id => id !== id_produto
        )
      },

      setZerarProdutosUsados() {
        this.produtosParaFiltroQueForamUsados = []
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})

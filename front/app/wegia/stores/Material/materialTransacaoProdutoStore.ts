
export const useMaterialTransacaoProdutoStore = defineStore('materialTransacaoProduto', {
  state: () => {
    return {

    }
  },

  getters: {

  },

  actions: {
      async fetchExcluirTransacaoProduto(id: number) {
          try {
              await MaterialTransacaoProdutoService.deletar(id)
          } catch (e) {
              throw e;
          }
      },

      async fetchAtualizarTransacaoProduto(id: number, body:  Partial<MaterialTransacaoProdutoAtualizarInterface>) {
        try {
          await MaterialTransacaoProdutoService.atualizar(id, body)
      } catch (e) {
          throw e;
      }
      }


  },
})

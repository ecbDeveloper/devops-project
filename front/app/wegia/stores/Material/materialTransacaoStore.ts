
export const useMaterialTransacaoStore = defineStore('materialTransacao', {
  state: () => {
    return {
      transacoes: {} as PaginacaoInterface<MaterialTransacaoInterface>,
      responsaveis: [] as MaterialTransacaoResponsavelInterface[],
      modalAberto: false
    }
  },

  getters: {
    getTransacoes: state => state.transacoes,
    getResponsaveisParaSelect: state => state.responsaveis.map(r => ({
      texto: r.nome,
      value: r.id_pessoa
    })),
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchTransacao(params: Partial<MaterialTransacaoBuscarPaginadoParamsInterface>) {
          try {
              const { data } = await MaterialTransacaoService.listar(params) as { data: PaginacaoInterface<MaterialTransacaoInterface> };
              this.transacoes = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCadastrarTransacao(body: MaterialTransacaoCadastrarInterface) {
        try {
          await MaterialTransacaoService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchTransacaoResponsaveis() {
        try {
            const { data } = await MaterialTransacaoService.buscarResponsaveis() as { data: MaterialTransacaoResponsavelInterface[] };
            this.responsaveis = data;
        } catch (e) {
            throw e;
        }
    },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})

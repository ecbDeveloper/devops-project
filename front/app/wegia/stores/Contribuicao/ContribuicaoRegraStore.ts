export const useContribuicaoRegraStore = defineStore('contribuicaoRegraStore', {
  state: () => {
    return {
      regrasFiltro: [] as ContribuicaoRegraInterface[],
      regraMeioPagamento: {} as PaginacaoInterface<ContribuicaoRegraMeioPagamentoInterface>
    }
  },

  getters: {
    getRegrasFiltro: (state) => state.regrasFiltro.map((regra) => {
      return {
        value: regra.id,
        texto: regra.regra
      }
    }),
    getRegraMeioPagamento: (state) => state.regraMeioPagamento
  },

  actions: {
    async fetchRegrasFiltro() {
      try {
          const { data } = await ContribuicaoRegraService.filtro() as { data: ContribuicaoRegraInterface[] };
          this.regrasFiltro = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchRegraMeioPagamento(params: Partial<PaginacaoDefaultParamsInterface>) {
      try {
          const { data } = await ContribuicaoRegraService.listarRegraMeioPagamento(params) as { data: PaginacaoInterface<ContribuicaoRegraMeioPagamentoInterface> };
          this.regraMeioPagamento = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchCadastrarRegraMeioPagamento(body: ContribuicaoRegraMeioPagamentoCadastrarInterface) {
      try {
        await ContribuicaoRegraService.criarRegraMeioPagamento(body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtualizarRegraMeioPagamento(id: number, body: Partial<ContribuicaoRegraMeioPagamentoCadastrarInterface>) {
      try {
        await ContribuicaoRegraService.atualizarRegraMeioPagamento(id, body)
      } catch (e) {
          throw e;
      }
    },

  },
})

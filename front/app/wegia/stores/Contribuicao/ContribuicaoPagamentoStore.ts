import ContribuicaoGatewayFactory from "~/service/Contribuicao/ContribuicaoGatewayFactory";

export const useContribuicaoPagamentoStore = defineStore('contribuicaoPagamentoStore', {
  state: () => {
    return {
      contribuicaoPagamento: [] as ContribuicaoPagamentoAposCriadoInterface[],
      cartao_hash: '' as string
    }
  },

  getters: {
    getContribuicaoPagamento: state => state.contribuicaoPagamento,
    getCartaoHash: state => state.cartao_hash
  },

  actions: {
    async fetchPagamento(body: Partial<ContribuicaoPagamentoCadastrarInterface>) {
      try {
          const { data } = await ContribuicaoPagamentoService.criar(body) as { data: ContribuicaoPagamentoAposCriadoInterface[] };
          this.contribuicaoPagamento = data
      } catch (e) {
          throw e;
      }
    },

    async fetchPagamentoNoGatewayPublico(config: PagamentoGatewayConfigInterface, gateway: string) {
      try {
          const data = await ContribuicaoGatewayFactory.realizarPagamento(config, gateway)
          this.cartao_hash = data
      } catch (e) {
        throw e;
      }
    },

    async fetchPagamentoSincronizar() {
      try {
          await ContribuicaoPagamentoService.sincronizar()
      } catch (e) {
        throw e;
      }
    }

  },
})

export const useContribuicaoMeioPagamentoStore = defineStore('contribuicaoMeioPagamentoStore', {
  state: () => {
    return {
      meios: {} as PaginacaoInterface<ContribuicaoMeioPagamentoInterface>,
      meiosFiltros: [] as ContribuicaoMeioPagamentoInterface[],
      meiosAtivos: [] as ContribuicaoMeioPagamentoAtivoInterface[],
    }
  },

  getters: {
    getMeios: (state) => state.meios,
    getMeiosAtivos: (state) => state.meiosAtivos,
    getMeiosFiltros: (state) => state.meiosFiltros.map((meio => {
      return {
        value: meio.id,
        texto: `${meio.meio} | ${meio.gateway.plataforma}`
      }
    })),
  },

  actions: {
    async fetchMeios(params: Partial<PaginacaoDefaultParamsInterface>) {
      try {
          const { data } = await ContribuicaoMeioPagamentoService.listar(params) as { data: PaginacaoInterface<ContribuicaoMeioPagamentoInterface> };
          this.meios = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchMeiosFiltro() {
      try {
          const { data } = await ContribuicaoMeioPagamentoService.filtro() as { data: ContribuicaoMeioPagamentoInterface[] };
          this.meiosFiltros = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchMeiosAtivos() {
      try {
          const { data } = await ContribuicaoMeioPagamentoService.ativo() as { data: ContribuicaoMeioPagamentoAtivoInterface[] };
          this.meiosAtivos = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchAtualizarMeio(id: number, body: Partial<ContribuicaoMeioPagamentoCadastrarInterface>) {
      try {
        await ContribuicaoMeioPagamentoService.atualizar(id, body)
      } catch (e) {
          throw e;
      }
    },

  },
})

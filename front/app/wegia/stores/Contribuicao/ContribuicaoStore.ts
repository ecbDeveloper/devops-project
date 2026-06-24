export const useContribuicaoStore = defineStore('contribuicaoStore', {
  state: () => {
    return {
      contribuicoes: {} as PaginacaoInterface<ContribuicaoInterface>,
      segundaVia: [] as ContribuicaoSegundaViaInterface[]
    }
  },

  getters: {
      getContribuicoes: (state) => state.contribuicoes,
      getSegundaVia: state => state.segundaVia
  },

  actions: {
    async fetchContribuicao(params: Partial<SocioControleContribuicaoBuscarTodosParamsInterface>) {
      try {
          const { data } = await ContribuicaoService.listar(params) as { data: PaginacaoInterface<ContribuicaoInterface> };
          this.contribuicoes = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchSegundaVia(cpfCnpj: string) {
      try {
        const { data } = await ContribuicaoService.buscarSegundaVia(cpfCnpj) as { data: ContribuicaoSegundaViaInterface[] };
        this.segundaVia = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchEnviarComprovanteEmail(body: ContribuicaoEnviarEmailInterface) {
      try {
        await ContribuicaoService.enviarComprovanteEmail(body)
      } catch (e) {
          throw e;
      }
    }


  },
})

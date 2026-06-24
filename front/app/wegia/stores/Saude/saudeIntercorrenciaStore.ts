
export const useSaudeIntercorrenciaStore = defineStore('intercorrenciaStore', {
  state: () => {
      return {
          intercorrencias: {} as PaginacaoInterface<SaudeIntercorrenciaInterface>
      }
  },

  getters: {
      getIntercorrencias: (state) => state.intercorrencias
  },

  actions: {
      async fetchIntercorrencias(id: number, params: Partial<SaudeIntercorrenciaBuscarTodosParamsInterface>) {
          try {
              const { data } = await SaudeFichaMedicaService.buscarIntercorrencia(id, params) as { data: PaginacaoInterface<SaudeIntercorrenciaInterface> };
              this.intercorrencias = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCadastrarIntercorrencia(id: number, body: SaudeIntercorrenciaCadastrarInterface) {
          try {
              await SaudeFichaMedicaService.cadastrarIntercorrencia(id, body)
          } catch (e) {
              throw e;
          }
      }
  },
})

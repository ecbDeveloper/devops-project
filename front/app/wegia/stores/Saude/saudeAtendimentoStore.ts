
export const useSaudeAtendimentoStore = defineStore('saudeAtendimento', {
  state: () => {
    return {
        atendimentos: {} as PaginacaoInterface<SaudeAtendimentoInterface>
    }
  },

  getters: {
    getAtendimentos: (state) => state.atendimentos
  },

  actions: {
      async fetchAtendimentos(id: number, params: Partial<SaudeAtendimentoBuscarTodosParamsInterface>) {
          try {
              const { data } = await SaudeFichaMedicaService.buscarAtendimentos(id, params) as { data: PaginacaoInterface<SaudeAtendimentoInterface> };
              this.atendimentos = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchAtendimentoCadastrar(id: number, body: SaudeAtendimentoCadastrarInterface) {
        try {
          await SaudeFichaMedicaService.cadastrarAtendimento(id, body)
        } catch (e) {
            throw e;
        }
      }

  },
})

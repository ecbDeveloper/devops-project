
export const useSaudeExameTipoStore = defineStore('saudeExameTipos', {
  state: () => {
    return {
        tipos: [] as SaudeExameTipoInterface[],
        modalAberto: false,
    }
  },

  getters: {
    getTiposParaSelect: (state) => state.tipos.map((tipo) => {
      return {
          texto: tipo.descricao,
          value: tipo.id_exame_tipo
      }
    }),
    getModalAberto: (state) => state.modalAberto,
  },

  actions: {
      async fetchExameTipos() {
          try {
              const { data } = await SaudeExameTipoService.listar() as { data: SaudeExameTipoInterface[] };
              this.tipos = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCriarExameTipo(body : SaudeExameTipoCadastrarInterface) {
        try {
          await SaudeExameTipoService.criar(body);
        } catch (e) {
            throw e;
        }
      },

      existeTipo(descricao: string) {
          return this.tipos.find((tipo) => tipo.descricao.toLowerCase() === descricao.toLowerCase())
      },

      setToggleModal() {
          this.modalAberto = !this.modalAberto;
      }
  },
})

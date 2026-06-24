export const useConfiguracaoImagemStore = defineStore('configuracaoImagemStore', {
  state: () => {
    return {
      imagens: [] as ConfiguracaoImagemInterface[]
    }
  },

  getters: {
    getImagens: state => state.imagens
  },

  actions: {
    async fetchImagens() {
      try {
          const { data } = await ConfiguracaoImagemService.listar() as { data: ConfiguracaoImagemInterface[] };
          this.imagens = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchCadastrarImagens(body: FormData | ConfiguracaoImagemCadastrarInterface) {
      try {
          await ConfiguracaoImagemService.criar(body)
      } catch (e) {
          throw e;
      }
    },

    async fetchCadastrarImagemNoCampo(id_campo: number, body: ConfiguracaoImagemCampoCadastrarInterface | FormData) {
      try {
        await ConfiguracaoImagemService.cadastrarImagemNoCampo(id_campo, body)
      } catch (e) {
        throw e;
      }
    },

    async fetchSincronizarImagemNoCampo(id_imagem: number, id_campo: number, body: ConfiguracaoImagemCampoSincronizarInterface | FormData) {
      try {
        await ConfiguracaoImagemService.sincronizarImagemNoCampo(id_imagem, id_campo, body)
      } catch (e) {
        throw e;
      }
    },

    async fetchDeletarImagem(id_imagem: number) {
      try {
        await ConfiguracaoImagemService.deletar(id_imagem)
      } catch (e) {
        throw e;
      }
    }
  },
})

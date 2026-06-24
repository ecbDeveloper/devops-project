export const useConfiguracaoEnderecoInstituicaoStore = defineStore('configuracaoEnderecoInstituicaoStore', {
  state: () => {
    return {
      endereco: null as null | ConfiguracaoEnderecoInstituicaoInterface
    }
  },

  getters: {
    getEndereco: state => state.endereco
  },

  actions: {
    async fetchEndereco() {
      try {
          const { data } = await ConfiguracaoEnderecoInstituicaoService.listar() as { data: ConfiguracaoEnderecoInstituicaoInterface };
          this.endereco = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchAtualizarEndereco(body: Partial<ConfiguracaoEnderecoInstituicaoAtualizarInterface>) {
      try {
          await ConfiguracaoEnderecoInstituicaoService.atualizarConfiguracao(body)
      } catch (e) {
          throw e;
      }
    },
  },
})

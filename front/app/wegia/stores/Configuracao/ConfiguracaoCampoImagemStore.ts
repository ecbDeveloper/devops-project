export const useConfiguracaoCampoImagemStore = defineStore('configuracaoCampoImagemStore', {
  state: () => {
    return {
      campoImage: [] as ConfiguracaoCampoImagemInterface[]
    }
  },

  getters: {
    getCampoImagem: state => state.campoImage,
    getCampoImagemLogo: state => state.campoImage.find(ci => ci.nome_campo == 'Logo'),
    getCampoImagemLogoUrl: state => {
      const logoPadrao = new URL(
        '@/assets/img/logo_wegia.png',
        import.meta.url
      ).href

      const logo = state.campoImage.find(ci => ci.nome_campo === 'Logo')

      return logo?.imagens?.[0]?.imagem || logoPadrao
    }
  },

  actions: {
    async fetchCampoImagem() {
      try {
          const { data } = await ConfiguracaoCampoImagemService.listar() as { data: ConfiguracaoCampoImagemInterface[] };
          this.campoImage = data;
      } catch (e) {
          throw e;
      }
    },
  },
})

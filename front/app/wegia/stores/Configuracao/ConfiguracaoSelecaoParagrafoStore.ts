export const useConfiguracaoSelecaoParagrafoStore = defineStore('configuracaoSelecaoParagrafoStore', {
  state: () => {
    return {
      paragrafos: [] as ConfiguracaoSelecaoParagrafoInterface[]
    }
  },

  getters: {
    getParagrafos: state => state.paragrafos,

    getTitulo: state =>
      state.paragrafos.find(p => p.nome_campo === 'Titulo'),

    getSubtitulo: state =>
      state.paragrafos.find(p => p.nome_campo === 'Subtitulo'),

    getConheca: state =>
      state.paragrafos.find(p => p.nome_campo === 'Conheça'),

    getObjetivo: state =>
      state.paragrafos.find(p => p.nome_campo === 'Objetivo'),

    getRodape: state =>
      state.paragrafos.find(p => p.nome_campo === 'Rodapé'),

    getContribuicaoMsg: state =>
      state.paragrafos.find(p => p.nome_campo === 'ContribuiçãoMSG'),

    getAgradecimentoDoador: state =>
      state.paragrafos.find(p => p.nome_campo === 'agradecimento_doador'),
  },

  actions: {
    async fetchParagrafos() {
      try {
          const { data } = await ConfiguracaoSelecaoParagrafoService.listar() as { data: ConfiguracaoSelecaoParagrafoInterface[] };
          this.paragrafos = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchAtualizarParagrafo(id_paragrafo: number, body: ConfiguracaoSelecaoParagrafoAtualizarInterface) {
      try {
          await ConfiguracaoSelecaoParagrafoService.atualizar(id_paragrafo, body)
      } catch (e) {
          throw e;
      }
    },
  },
})

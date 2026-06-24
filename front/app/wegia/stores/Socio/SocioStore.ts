export const useSocioStore = defineStore('socioStore', {
  state: () => {
    return {
      socios: {} as PaginacaoInterface<SocioInterface>,
      sociosAniversariantes: {} as PaginacaoInterface<SocioInterface>,
      sociosGraficosTipos: [] as SocioTipoEstatisticaInterface[],
      sociosRelatorio: [] as SocioInterface[],

      socioPublico: null as SocioPublicoInterface | null
    }
  },

  getters: {
    getSocios: (state) => state.socios,
    getSociosAniversariantes: (state) => state.sociosAniversariantes,
    getSociosRelatorio: state => state.sociosRelatorio,
    getSociosGraficosTipos: state => state.sociosGraficosTipos,

    getSocioPublico: (state) => state.socioPublico
  },

  actions: {
    async fetchSocios(params: Partial<PaginacaoDefaultParamsInterface>) {
      try {
          const { data } = await SocioService.listar(params) as { data: PaginacaoInterface<SocioInterface> };
          this.socios = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchSociosAniversariantes(params: Partial<PaginacaoDefaultParamsInterface>) {
      try {
          const { data } = await SocioService.buscarSociosAniversariantes(params) as { data: PaginacaoInterface<SocioInterface> };
          this.sociosAniversariantes = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchSociosGraficosTipos() {
      try {
          const { data } = await SocioService.buscarSociosGraficosTipos() as { data: SocioTipoEstatisticaInterface[] };
          this.sociosGraficosTipos = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchSociosRelatorio(params: Partial<SocioRelatorioInterface>) {
      try {
          const { data } = await SocioService.buscarSociosRelatorio(params) as { data: SocioInterface[] };
          this.sociosRelatorio = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchSocioPublico(cpfCnpj: string) {
      try {
          const { data } = await SocioService.buscarSocioPublico(cpfCnpj) as { data: SocioPublicoInterface };
          this.socioPublico = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchCadastrarSocio(body: SocioCadastrarInterface) {
      try {
        await SocioService.criar(body)
      } catch (e) {
          throw e;
      }
    },

    async fetchCadastrarSocioPessoa(body: SocioPessoaCadastrarInterface) {
      try {
        await SocioService.criarSocioPessoa(body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtualizarSocio(id: number, id_pessoa: number, body: Partial<SocioAtualizarInterface>) {
      try {
        await SocioService.atualizarSocioPessoa(id, id_pessoa, body)
      } catch (e) {
          throw e;
      }
    },

    setSocioPublico(socioPublico: SocioPublicoInterface | null = null) {
      this.socioPublico = socioPublico
    }

  },
})

export const useSocioTagStore = defineStore('socioTagStore', {
  state: () => {
    return {
      tags: {} as PaginacaoInterface<SocioTagInterface>,
      tagsParaFiltro: [] as SocioTagInterface[]
    }
  },

  getters: {
    getTags: (state) => state.tags,
    getTagsFiltros: (state) => state.tagsParaFiltro.map((g) => {
      return  {
        value: g.id_sociotag,
        texto: g.tag
      }
    })
  },

  actions: {
    async fetchTags(params: Partial<PaginacaoDefaultParamsInterface>) {
      try {
          const { data } = await SocioTagService.listar(params) as { data: PaginacaoInterface<SocioTagInterface> };
          this.tags = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchTagsFiltro() {
      try {
          const { data } = await SocioTagService.filtro() as { data: SocioTagInterface[] };
          this.tagsParaFiltro = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchCadastrarTag(body: SocioTagCadastrarInterface) {
      try {
        await SocioTagService.criar(body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtualizarTag(id: number, body: Partial<SocioTagCadastrarInterface>) {
      try {
        await SocioTagService.atualizar(id, body)
      } catch (e) {
          throw e;
      }
    },

  },
})

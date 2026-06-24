
export const useMaterialUnidadeStore = defineStore('materialUnidade', {
  state: () => {
    return {
      unidades: {} as PaginacaoInterface<MaterialUnidadeInterface>,
      unidadesParaFiltros: [] as MaterialUnidadeInterface[],
      modalAberto: false
    }
  },

  getters: {
    getUnidadesParaFiltrosParaSelect: (state) => state.unidadesParaFiltros.map(c => ({
      texto: c.descricao,
      value: c.id_unidade
    })),
    getUnidades: state => state.unidades,
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchUnidades(params: Partial<PaginacaoDefaultParamsInterface>) {
      try {
          const { data } = await MaterialUnidadeService.listar(params) as { data: PaginacaoInterface<MaterialUnidadeInterface> };
          this.unidades = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchUnidadesParaFiltros() {
          try {
              const { data } = await MaterialUnidadeService.buscarUnidadeParaFiltro() as { data: MaterialUnidadeInterface[] };
              this.unidadesParaFiltros = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCadastrarUnidade(body: MaterialUnidadeCadastrarInterface) {
        try {
          await MaterialUnidadeService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizarUnidade(id: number, body: MaterialUnidadeCadastrarInterface) {
        try {
          await MaterialUnidadeService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      },

      existeUnidade(descricao: string) {
        return this.unidadesParaFiltros.find((categoria) => categoria.descricao.toLowerCase() === descricao.toLowerCase())
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})

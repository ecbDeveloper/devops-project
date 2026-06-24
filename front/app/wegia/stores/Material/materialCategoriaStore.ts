
export const useMaterialCategoriaStore = defineStore('materialCategoria', {
  state: () => {
    return {
      categorias: {} as PaginacaoInterface<MaterialCategoriaInterface>,
      categoriasParaFiltros: [] as MaterialCategoriaInterface[],
      modalAberto: false
    }
  },

  getters: {
    getCategoriasParaFiltrosParaSelect: (state) => state.categoriasParaFiltros.map(c => ({
      texto: c.descricao,
      value: c.id_categoria
    })),
    getCategorias: (state) => state.categorias,
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchCategorias(params: Partial<PaginacaoDefaultParamsInterface>) {
        try {
            const { data } = await MaterialCategoriaService.listar(params) as { data: PaginacaoInterface<MaterialCategoriaInterface> };
            this.categorias = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchCategoriasParaFiltros() {
          try {
              const { data } = await MaterialCategoriaService.buscarCodigoParaFiltro() as { data: MaterialCategoriaInterface[] };
              this.categoriasParaFiltros = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchCadastrarCategoria(body: MaterialCategoriaCadastrarInterface) {
        try {
          await MaterialCategoriaService.criar(body)
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizarCategoria(id: number, body: MaterialCategoriaCadastrarInterface) {
        try {
          await MaterialCategoriaService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      },

      existeCategoria(descricao: string) {
        return this.categoriasParaFiltros.find((categoria) => categoria.descricao.toLowerCase() === descricao.toLowerCase())
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})

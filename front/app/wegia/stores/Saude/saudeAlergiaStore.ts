
export const useSaudeAlergiaStore = defineStore('saudeAlergia', {
  state: () => {
    return {
        alergias: [] as SaudeAlergiaInterface[],
        fichaMedicaAlergias: {} as PaginacaoInterface<SaudeFichaMedicaAlergiaInterface>,
        modalAberto: false
    }
  },

  getters: {
    getAlergiasParaSelect: (state) => state.alergias.map((a) => {
      return {
          texto: a.nome,
          value: a.id_alergia
      }
    }),
    getFichaMedicaAlergias: (state) => state.fichaMedicaAlergias,
    getModalAberto: state => state.modalAberto
  },

  actions: {
      async fetchAlergias(params: Partial<SaudeAlergiaBuscarTodosParamsInterface>) {
          try {
              const { data } = await SaudeAlergiaService.listar(params) as { data: SaudeAlergiaInterface[] };
              this.alergias = data;
          } catch (e) {
              throw e;
          }
      },

      async fetchAlergiasCadastrar(body: SaudeAlergiaCadastrarInterface) {
        try {
          await SaudeAlergiaService.criar(body)
        } catch (e) {
            throw e;
        }
      },

      async fetchFichaMedicaAlergias(id: number, params: Partial<SaudeFichaMedicaAlergiaBuscarTodosParamsInterface>) {
        try {
            const { data } = await SaudeFichaMedicaService.buscarFichaMedicaAlergias(id, params) as { data: PaginacaoInterface<SaudeFichaMedicaAlergiaInterface> };
            this.fichaMedicaAlergias = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchFichaMedicaAlergiasCadastrar(id_fichamedica: number, id_alergia: number) {
        try {
          await SaudeFichaMedicaService.cadastrarFichaMedicaAlergias(id_fichamedica, id_alergia)
        } catch (e) {
            throw e;
        }
      },

      async fetchFichaMedicaAlergiasDeletar(id: number) {
        try {
          await SaudeFichaMedicaService.excluirFichaMedicaAlergias(id)
        } catch (e) {
            throw e;
        }
      },

      setAbrirModal() {
        this.modalAberto = !this.modalAberto
      }

  },
})


export const useSaudeMedicacaoStore = defineStore('saudeMedicacao', {
  state: () => {
      return {
          medicacao: {} as PaginacaoInterface<SaudeMedicacaoInterface>,
          administracao: {} as PaginacaoInterface<SaudeMedicacaoAdministracaoInterface>,
          id_ficha_medica: -1 as Number,
          modalAberto: false as Boolean
      }
  },

  getters: {
      getMedicacao: (state) => state.medicacao,
      getAdministracao: (state) => state.administracao,
      getIdFichaMedica: state => state.id_ficha_medica,
      getModalAberto: (state) => state.modalAberto
  },

  actions: {
      async fetchMedicacao(id: number, body: Partial<SaudeMedicacaoBuscarTodosParamsInterface>) {
          try {
              const { data } = await SaudeFichaMedicaService.buscarMedicacao(id, body) as { data: PaginacaoInterface<SaudeMedicacaoInterface> };
              this.id_ficha_medica = id
              this.medicacao = data;
          } catch (e) {
              this.id_ficha_medica = -1
              throw e;
          }
      },

      async fetchAtualizar(id: number, body: SaudeMedicacaoAtualizarInterface) {
        try {
          await SaudeMedicacaoService.atualizar(id, body)
        } catch (e) {
            throw e;
        }
      },

      async fetchAdministracao(id: number, body: Partial<SaudeMedicacaoAdministracaoBuscarTodosParamsInterface>) {
        try {
            const { data } = await SaudeMedicacaoService.buscarAdministracao(id, body) as { data: PaginacaoInterface<SaudeMedicacaoAdministracaoInterface> };
            this.administracao = data;
        } catch (e) {
            throw e;
        }
      },

      async fetchCadastrarAdministracaoEmMassa(body: SaudeMedicacaoAdministracaoCadastrarEmMassaInterface) {
        try {
            await SaudeMedicacaoService.medicacaoAdministracaoEmMassaCadastrar(body)
        } catch (e) {
            throw e;
        }
      },

      async fetchCadastrarAdministracao(id: number, body: SaudeMedicacaoAdministracaoCadastrarInterface) {
        try {
          await SaudeMedicacaoService.medicacaoAdministracaoCadastrar(id, body)
        } catch (e) {
            throw e;
        }
      },

      setToggleModal() {
          this.modalAberto = !this.modalAberto
      },


  },
})

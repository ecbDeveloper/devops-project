export const usePessoaArquivoStore = defineStore('pessoaArquivo', {
    state: () => {
        return {
            arquivos: {} as PessoaArquivoPaginadoInterface,
            tipos: [] as PessoaTipoArquivoInterface[],
            modal: false,
            modalTipo: false,
        }
    },
    getters: {
        getArquivos: (state) => state.arquivos,
        getTipos: (state) => state.tipos,
        getTiposParaSelect: (state) => {
          return state.tipos.map(r => {
            return {
              texto: r.descricao,
              value: r.id_pessoa_tipo_arquivo
            }
          })
        },
        getModal: (state) => state.modal,
        getModalTipo: (state) => state.modalTipo
    },
    actions: {
      async fetchArquivos(id_pessoa: number, params: Partial<PessoaArquivoBuscarPaginadoInterface>) {
        try {
          const {data} = await PessoaService.buscarArquivo(id_pessoa, params) as { data: PessoaArquivoPaginadoInterface };
          this.arquivos = data
        } catch (e) {
          throw e;
        }
      },

      async fetchCadastrarArquivo(id: number, body: FormData) {
        try {
          await PessoaService.cadastrarArquivo(id, body)
        } catch (e) {
          throw e;
        }
      },

      async fetchExcluirArquivo(id: number) {
        try {
          await PessoaService.excluirArquivo(id)
        } catch (e) {
          throw e;
        }
      },

      async buscarArquivoTipos() {
        try {
          const { data } = await PessoaService.buscarArquivoTipos() as { data: PessoaTipoArquivoInterface[] }
          this.tipos = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async cadastrarArquivoTipo(body: PessoaTipoArquivoCadastrarInterface) {
        try {
          await PessoaService.cadastrarArquivoTipo(body)
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      setModal() {
        this.modal = !this.modal
      },
      setModalTipo() {
        this.modalTipo = !this.modalTipo
      },
    },
})
export const useConfiguracaoContatoInstituicaoStore = defineStore('configuracaoContatoInstituicaoStore', {
  state: () => {
    return {
      contatos: {} as ConfiguracaoContatoInstituicaoInterface[]
    }
  },

  getters: {
    getContatos: state => state.contatos
  },

  actions: {
    async fetchContatos() {
      try {
          const { data } = await ConfiguracaoContatoInstituicaoService.listar() as { data: ConfiguracaoContatoInstituicaoInterface[] };
        this.contatos = data;
      } catch (e) {
        throw e;
      }
    },

    async fetchCadastrarContato(body: ConfiguracaoContatoInstituicaoCadastrarInterface) {
        try {
            await ConfiguracaoContatoInstituicaoService.criar(body)
        } catch (e) {
            throw e;
        }
    },

    async fetchAtualizarContato(id_contato: number, body: Partial<ConfiguracaoContatoInstituicaoCadastrarInterface>) {
      try {
          await ConfiguracaoContatoInstituicaoService.atualizar(id_contato, body)
      } catch (e) {
          throw e;
      }
    },

    async fetchDeletarContato(id_contato: number) {
      try {
          await ConfiguracaoContatoInstituicaoService.deletar(id_contato)
      } catch (e) {
          throw e;
      }
    }
  }
})

export const useAtendidoAceitacaoStore = defineStore('atendidoAceitacaoStore', {
  state: () => {
    return {
      atendidoAceitacao: {} as PaginacaoInterface<AtendidoAceitacaoInterface>,
      atendidoAceitacaoPorId: {} as AtendidoAceitacaoInterface,
      status: [] as AtendidoAceitacaoStatusInterface[]
    }
  },

  getters: {
    getAtendidoAceitacao: state => state.atendidoAceitacao,
    getAtendidoAceitacaoPorId: state => state.atendidoAceitacaoPorId,
    getStatusParaSelect: state => {
      return state.status.map(status => ({
        texto: status.descricao,
        value: status.id
      }))
    }
  },

  actions: {
    async fetchAtendidoAceitacao(params: Partial<AtendidoAceitacaoBuscarTodosParamsInterface> = {}) {
      try {
          const { data } = await AtendidoAceitacaoService.listar(params) as { data: PaginacaoInterface<AtendidoAceitacaoInterface>};
          this.atendidoAceitacao = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoPorId(id: number) {
      try {
          const { data } = await AtendidoAceitacaoService.buscarPorId(id) as { data: AtendidoAceitacaoInterface};
          this.atendidoAceitacaoPorId = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoStatus() {
      try {
          const { data } = await AtendidoAceitacaoService.status() as { data: AtendidoAceitacaoStatusInterface[] };
          this.status = data;
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoCadastrar(body: AtendidoAceitacaoCadastrarInterface) {
      try {
          await AtendidoAceitacaoService.criar(body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoEtapaCadastrar(id_processo: number, body: AtendidoAceitacaoEtapaCadastrarInterface) {
      try {
          await AtendidoAceitacaoService.criarEtapa(id_processo, body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoCadastrarComPessoa(id_pessoa: number) {
      try {
          await AtendidoAceitacaoService.criarComPessoa(id_pessoa)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoArquivoCadastrar(body: FormData, id_processo: number) {
      try {
          await AtendidoAceitacaoService.cadastrarArquivo(id_processo, body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoAtualizar(id_processo: number, body: AtendidoAceitacaoAtualizarInterface) {
      try {
          await AtendidoAceitacaoService.atualizar(id_processo, body)
      } catch (e) {
          throw e;
      }
    }
  },

})

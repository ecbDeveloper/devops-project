export const useAtendidoAceitacaoEtapaStore = defineStore('atendidoAceitacaoEtapaStore', {
  state: () => {
    return {

    }
  },

  getters: {

  },

  actions: {

    async fetchAtendidoAceitacaoEtapaArquivoCadastrar(id_etapa: number, body: FormData) {
      try {
          await AtendidoAceitacaoEtapaService.cadastrarArquivo(id_etapa, body)
      } catch (e) {
          throw e;
      }
    },

    async fetchAtendidoAceitacaoEtapaEditar(id: number, body: AtendidoAceitacaoEtapaEditarInterface) {
      try {
          await AtendidoAceitacaoEtapaService.atualizar(id, body)
      } catch (e) {
          throw e;
      }
    }
  },
})

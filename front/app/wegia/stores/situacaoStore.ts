import type { SituacaoInterface } from "~/interface/Situacao/SituacaoInterface";
import SituacaoService from "~/service/SituacaoService";

export const useSituacaoStore = defineStore('situacao', {
    state: () => {
        return {
            situacao: [] as SituacaoInterface[],
            modalAberto: false
        }
    },
    getters: {
        getSituacao: (state) => state.situacao,
        getSituacaoParaSelect: (state) => {
          return state.situacao.map(s => {
              return {
                value: s.id_situacao,
                texto: s.situacoes
              }
          })
        },
        getModalAberto: (state) => state.modalAberto
    },
    actions: {
      async fetchSituacao() {
        try {
          const {data} = await SituacaoService.getSituacao() as { data: SituacaoInterface[] };
          this.situacao = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchCadastrarSituacao(situacao: object) {
        try {
          const {data} = await SituacaoService.postSituacao(situacao) as { data: SituacaoInterface };
          this.situacao.push(data)
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      setModalAberto() {
        this.modalAberto = !this.modalAberto
      }
    },
  })
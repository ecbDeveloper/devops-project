import type { AtendidoOcorrenciaInterface } from "~/interface/Atendido/Ocorrencia/AtendidoOcorrenciaInterface";
import type { AtendidoOcorrenciaPaginacaoInterface } from "~/interface/Atendido/Ocorrencia/AtendidoOcorrenciaPaginacaoInterface";
import type { AtendidoOcorrenciaTipoInterface } from "~/interface/Atendido/Ocorrencia/AtendidoOcorrenciaTipoInterface";
import AtendidoService from "~/service/AtendidoService";

export const useOcorrenciaStore = defineStore('ocorrencia', {
    state: () => {
        return {
            ocorrencias: {} as AtendidoOcorrenciaPaginacaoInterface,
            ocorrencia: {} as AtendidoOcorrenciaInterface,
            ocorrenciaTipo: [] as AtendidoOcorrenciaTipoInterface[],
            modalAberto: false
        }
    },
    getters: {
        getOcorrencias: (state) => state.ocorrencias,
        getOcorrenciaTipoSelect: (state) => {
            return state.ocorrenciaTipo.map((tipo) => {
                return {
                    value: tipo.idatendido_ocorrencia_tipos,
                    texto: tipo.descricao
                }
            })
        },
        getModalAberto: (state) => state.modalAberto
    },
    actions: {
      async fetchOcorrencia (body: object, id_atendido: number) {
        try {
          const {data} = await AtendidoService.cadastrarOcorrencia(body, id_atendido) as { data: AtendidoOcorrenciaInterface };
          this.ocorrencia = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchBuscarOcorrencias (id_atendido: number, params: Partial<AtendidoOcorrenciaBuscarTodosParamsInterface>) {
        try {
          const queryString = new URLSearchParams(params).toString();
          const {data} = await AtendidoService.buscarOcorrencias(id_atendido, queryString) as { data: AtendidoOcorrenciaPaginacaoInterface };
          this.ocorrencias = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchBuscarOcorrenciaTipo() {
        try {
            const {data} = await AtendidoService.buscarOcorrenciaTipos() as { data: AtendidoOcorrenciaTipoInterface[] };
            this.ocorrenciaTipo = data
          } catch (e) {
            console.log(e)
            throw e;
          }
      },
      async toggleModal() {
        this.modalAberto = !this.modalAberto
      }
    },
  })
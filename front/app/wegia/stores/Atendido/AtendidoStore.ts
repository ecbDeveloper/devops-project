import type { AtendidoInterface } from "~/interface/Atendido/AtendidoInterface";
import type { AtendidoPaginacaoInterface } from "~/interface/Atendido/AtendidoPaginacaoInterface";
import type { AtendidoStatusInterface } from "~/interface/Atendido/AtendidoStatusInterface";
import type { AtendidoTipoInterface } from "~/interface/Atendido/AtendidoTipoInterface";
import AtendidoService from "~/service/AtendidoService";

export const useAtendidoStore = defineStore('atendido', {
    state: () => {
        return {
            atendidos: {} as AtendidoPaginacaoInterface,
            atendido: {} as AtendidoInterface,
            atendidoCadastrado: {} as AtendidoInterface,
            atendidoStatus: [] as AtendidoStatusInterface[],
            atendidoTipo: [] as AtendidoTipoInterface[],
            modalAberto: false
        }
    },
    getters: {
        getAtendidos: (state) => state.atendidos,
        getAtendido: (state) => state.atendido,
        getAtendidoStatusSelect: (state) => {
            return state.atendidoStatus.map((item: AtendidoStatusInterface) => {
                return {
                    value: item.idatendido_status,
                    texto: item.status
                }
            })
        },
        getAtendidoTipoSelect: (state) => {
            return state.atendidoTipo.map((item: AtendidoTipoInterface) => {
                return {
                    value: item.idatendido_tipo,
                    texto: item.descricao
                }
            })
        },
        getModalAberto: (state) => state.modalAberto
    },
    actions: {
      async fetchAtendido (body: object) {
        try {
          const {data} = await AtendidoService.cadastrarAtendido(body) as { data: AtendidoInterface };
          this.atendidoCadastrado = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchBuscarAtendidoId (id: number, withString: string = '') {
        try {
          const {data} = await AtendidoService.buscarAtendidoId(id, withString) as { data: AtendidoInterface };
          this.atendido = data
        }catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchAtualizarAtendido(id: number, body: Partial<AtendidoAtualizarInterface>) {
        try {
          await AtendidoService.atualizarAtendido(id, body)
        } catch (e) {
          throw e;
        }
      },
      async fetchBuscarAtendidos (params: object) {
        try {
          const queryString = new URLSearchParams(params).toString();
          const {data} = await AtendidoService.buscarAtendidos(queryString) as { data: AtendidoPaginacaoInterface };
          this.atendidos = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchBuscarStatus () {
        try {
          const {data} = await AtendidoService.buscarStatus() as { data: AtendidoStatusInterface[] };
          this.atendidoStatus = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchBuscarTipo() {
        try {
          const {data} = await AtendidoService.buscarTipo() as { data: AtendidoTipoInterface[] };
          this.atendidoTipo = data
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
import type { FuncionarioListaInfoInterface } from "~/interface/Funcionario/FuncionarioListaInfoInterface";
import FuncionarioService from "~/service/FuncionarioService";
import type { FuncionarioOutrasInfosPaginacaoInterface } from "~/interface/Funcionario/FuncionarioOutrasInfosPaginacaoInterface";
import type { FuncionarioOutrasInfosInterface } from "~/interface/Funcionario/FuncionarioOutrasInfosInterface";

export const useOutrasInfosStore = defineStore('outrasInfos', {
    state: () => {
        return {
            listaInfo: [] as FuncionarioListaInfoInterface[],
            outrasInfosPaginacao: {} as FuncionarioOutrasInfosPaginacaoInterface,
            outrasInfos: {} as FuncionarioOutrasInfosInterface,
            modalOutraInfos: false,
            modalOutraListaInfos: false
        }
    },
    getters: {
        getListaInfos: (state) => state.listaInfo,
        getOutrasInfosPaginacao: (state) => state.outrasInfosPaginacao,
        getOutrasInfos: (state) => state.outrasInfos,
        getModalOutrasInfosAberto: (state) => state.modalOutraInfos,
        getModalOutraListaInfos: (state) => state.modalOutraListaInfos
    },
    actions: {
      async fetchOutrasInfos(params = {}, id_funcionario: number) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await FuncionarioService.buscarOutrasInformacoes(queryString, id_funcionario) as {data: FuncionarioOutrasInfosPaginacaoInterface };
          console.log(data)
          this.outrasInfosPaginacao = data
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },
      async fetchCadastrarOutrasInfos(id_funcionario: number, id_funcionario_lista_info: number, body: { dado: string}) {
        try {
          const {data} = await FuncionarioService
            .cadastrarOutrasInformacoes(id_funcionario, id_funcionario_lista_info, body) as {data: FuncionarioOutrasInfosInterface };

          this.outrasInfos = data
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },
      async fetchDeletarOutrasInfos(id_outra_info: number) {
        try {
          const data = await FuncionarioService.deletarOutraInfo(id_outra_info) as {data: boolean };

          return data
        } catch (e) {
          console.log("error => ", e)
          return false
        }
      },

      async fetchOutraListaInfos() {
        try {
          const {data} = await FuncionarioService.buscarListaInfos() as {data: FuncionarioListaInfoInterface[] };

          this.listaInfo = data
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },
      async fetchCadastrarOutraListaInfos(body: {descricao: String}) {
        try {
          const {data} = await FuncionarioService.cadastrarListaInfos(body) as {data: FuncionarioListaInfoInterface };

          this.listaInfo.push(data)
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },

      setModalOutrasInfosAberto() {
        this.modalOutraInfos = !this.modalOutraInfos
      },
      setModalOutrasListaInfosAberto() {
        this.modalOutraListaInfos = !this.modalOutraListaInfos
      }
    },
})
import type { FuncionarioInterface } from "~/interface/Funcionario/FuncionarioInterface";
import type { FuncionarioPaginacaoInterface } from "~/interface/Funcionario/FuncionarioPaginacaoInterface";
import type { FuncionarioBuscarTodosParamsInterface } from "~/interface/Funcionario/FuncionarioBuscarTodosParamsInterface";
import FuncionarioService from "~/service/FuncionarioService";

export const useFuncionarioStore = defineStore('funcionario', {
    state: () => {
        return {
            funcionarios: [] as FuncionarioInterface[],
            funcionariosPaginacao: {} as FuncionarioPaginacaoInterface,
            funcionario: {} as FuncionarioInterface,
            modalAberto: false,
        }
    },
    getters: {
        getFuncionariosAutoComplete: (state) => {
          return state.funcionarios.map(f => ({
            texto: f.pessoa.nome,
            value: f.pessoa.id_pessoa
          }))
        },
        getFuncionarioPaginacao: (state) => state.funcionariosPaginacao,
        getFuncionario: (state) => state.funcionario,
        getModalAberto: (state) => state.modalAberto,
    },
    actions: {
      async fetchCadastrarFuncionario(body: object) {
        try {
          const {data, status} = await FuncionarioService.cadastrarFuncionario(body) as { data: {}, status: string };
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },
      async fetchTodosFuncionarios(params: FuncionarioBuscarTodosParamsInterface = {}) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await FuncionarioService.buscarTodosFuncionarios(queryString) as {data: FuncionarioInterface[] };
          this.funcionarios = data
        } catch (e) {
          throw e;
        }
      },
      async fetchFuncionarios(params = {}) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await FuncionarioService.buscarFuncionarios(queryString) as {data: FuncionarioPaginacaoInterface };
          this.funcionariosPaginacao = data
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },
      async fetchFuncionario(id: number) {
        try {
          const {data} = await FuncionarioService.buscarFuncionario(id) as {data: FuncionarioInterface };
          this.funcionario = data
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },
      async fetchAtualizarFuncionario(body: JSON, id_funcionario: number) {
        try {
          const {data} = await FuncionarioService.atualizarFuncionario(body, id_funcionario) as {data: FuncionarioInterface };
          this.funcionario = data
        } catch (e) {
          console.log("error => ", e)
          throw e;
        }
      },

      setFuncionario(funcionario: FuncionarioInterface) {
        this.funcionario = funcionario
      },
      setModalAberto() {
        this.modalAberto = !this.modalAberto
      }
    },
})
import type { FuncionarioCargaHorariaInterface } from "~/interface/Funcionario/CargaHoraria/FuncionarioCargaHorariaInterface";
import type { FuncionarioQuadroHorarioEscalaInterface } from "~/interface/Funcionario/FuncionarioQuadroHorarioEscalaInterface";
import type { FuncionarioQuadroHorarioTipoInterface } from "~/interface/Funcionario/FuncionarioQuadroHorarioTipoInterface";
import FuncionarioService from "~/service/FuncionarioService";

export const useCargaHorariaStore = defineStore('cargaHoraria', {
    state: () => {
        return {
            cargaHoraria: {} as FuncionarioCargaHorariaInterface,
            quadroHorarioEscala: [] as FuncionarioQuadroHorarioEscalaInterface[],
            quadroHorarioTipo: [] as FuncionarioQuadroHorarioTipoInterface[],
            modalEscalaAberto: false as Boolean,
            modalHorarioTipoAberto: false as Boolean
        }
    },
    getters: {
        getCargaHoraria: (state) => state.cargaHoraria,
        getEscalaParaSelect: (state) => {
          return state.quadroHorarioEscala.map(s => {
              return {
                value: s.id_escala,
                texto: s.descricao
              }
          })
        },
        getHorarioTipoParaSelect: (state) => {
          return state.quadroHorarioTipo.map(s => {
              return {
                value: s.id_tipo,
                texto: s.descricao
              }
          })
        },
        getModalEscalaAberto: (state) => state.modalEscalaAberto,
        getModalHorarioTipoAberto: (state) => state.modalHorarioTipoAberto
    },
    actions: {
      async fetchCargaHoraria(id_funcionario: number) {
        try {
          const {data} = await FuncionarioService.buscarCargaHoraria(id_funcionario) as { data: FuncionarioCargaHorariaInterface };
          this.cargaHoraria = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchCadastrarCargaHoraria(body:any, id_funcionario: number) {
        try {
          const {data} = await FuncionarioService.cadastrarCargaHoraria(body, id_funcionario) as { data: FuncionarioCargaHorariaInterface };
          this.cargaHoraria = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchEscala() {
        try {
          const {data} = await FuncionarioService.getQuadroHorarioEscala() as { data: FuncionarioQuadroHorarioEscalaInterface[] };
          this.quadroHorarioEscala = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchHorarioTipo() {
        try {
          const {data} = await FuncionarioService.getQuadroHorarioTipo() as { data: FuncionarioQuadroHorarioTipoInterface[] };
          this.quadroHorarioTipo = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      setModalEscalaAberto() {
        this.modalEscalaAberto = !this.modalEscalaAberto
      },
      setModalHorarioTipoAberto() {
        this.modalHorarioTipoAberto = !this.modalHorarioTipoAberto
      }
    },
})
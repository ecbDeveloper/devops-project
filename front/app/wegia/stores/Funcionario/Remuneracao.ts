
import type { FuncionarioRemuneracaoInterface } from "~/interface/Funcionario/Remuneracao/FuncionarioRemuneracaoInterface";
import type { FuncionarioRemuneracaoPaginacaoInterface } from "~/interface/Funcionario/Remuneracao/FuncionarioRemuneracaoPaginacaoInterface";
import type { FuncionarioRemuneracaoTipoInterface } from "~/interface/Funcionario/Remuneracao/FuncionarioRemuneracaoTipoInterface";
import FuncionarioService from "~/service/FuncionarioService";

export const useRemuneracaoStore = defineStore('remuneracao', {
    state: () => {
        return {
            remuneracoes: {} as FuncionarioRemuneracaoPaginacaoInterface,
            remuneracao: {} as FuncionarioRemuneracaoInterface,
            remuneracaoTotal: 0 as Number,
            tipoRemuneracao: [] as FuncionarioRemuneracaoTipoInterface[],
            modalAberto: false as Boolean,
            modalTipoAberto: false as Boolean,
        }
    },
    getters: {
        getRemuneracoes: (state) => state.remuneracoes,
        getRemuneracao: (state) => state.remuneracao,
        getRemuneracaoTotal: (state) => state.remuneracaoTotal,
        getTipoRemunracao: (state) => state.tipoRemuneracao,
        getTipoRemuneracaoParaSelect: (state) => {
          return state.tipoRemuneracao.map(r => {
            return {
              texto: r.descricao,
              value: r.idfuncionario_remuneracao_tipo
            }
          })
        },
        getModalAberto: (state) => state.modalAberto,
        getModalTipoAberto: (state) => state.modalTipoAberto
    },
    actions: {
      async fetchRemuneraca(id_funcionario: number, params: Object = {}) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await FuncionarioService.buscarRemuneracao(id_funcionario, queryString) as { data: FuncionarioRemuneracaoPaginacaoInterface };
          this.remuneracoes = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchCadastrarRemuneracao(body) {
        try {
          const {data} = await FuncionarioService.cadastrarRemuneracao(body) as { data: FuncionarioRemuneracaoInterface };
          this.remuneracaoTotal = Number(this.remuneracaoTotal) + Number(data.valor)
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchDeletarRemuneracao(id_remuneracao: number) {
        try {
          const {data} = await FuncionarioService.deletarRemuneracao(id_remuneracao) as { data: Boolean };
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchBuscarRemuneracaoTotal(id_funcionario: number) {
        try {
          const {data} = await FuncionarioService.buscarRemuneracaoTotal(id_funcionario) as { data: Number };
          this.remuneracaoTotal = data
          return data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchBuscarTipoRemuneracao() {
        try {
          const {data} = await FuncionarioService.buscarTipoRemuneracao() as { data: FuncionarioRemuneracaoTipoInterface[] };
          this.tipoRemuneracao = data
          return data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchCadastrarTipoRemuneracao(body: {descricao: String}) {
        try {
          const {data} = await FuncionarioService.cadastrarTipoRemuneracao(body) as { data: FuncionarioRemuneracaoTipoInterface };
          this.tipoRemuneracao.push(data)
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      setModal() {
        this.modalAberto = !this.modalAberto
      },

      setTipoModal() {
        this.modalTipoAberto = !this.modalTipoAberto
      }
    },
  })
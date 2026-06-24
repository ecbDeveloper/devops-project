import type { PessoaDependenteInterface } from "~/interface/Pessoa/Dependente/PessoaDependenteInterface";
import type { PessoaDependentePaginacaoInterface } from "~/interface/Pessoa/Dependente/PessoaDependentePaginacaoInterface";
import PessoaService from "~/service/PessoaService";

export const useDependenteStore = defineStore('pessoaDependente', {
    state: () => {
        return {
            dependentes: {} as PessoaDependentePaginacaoInterface,
            dependente: {} as PessoaDependenteInterface,
            modal: false,
        }
    },
    getters: {
        getDependentes: (state) => state.dependentes,
        getDependente: (state) => state.dependente,
        getModal: (state) => state.modal,
    },
    actions: {
      async fetchDependentes(id_pessoa: number, params = {}) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await PessoaService.buscarDependentes(id_pessoa, queryString) as { data: PessoaDependentePaginacaoInterface };
          this.dependentes = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchDependente(id_dependente: number, params = {}) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await PessoaService.buscarDependentePorId(id_dependente, queryString) as { data: PessoaDependenteInterface };
          this.dependente = data
        } catch (e) {
          throw e;
        }
      },

      async fetchCadastrarDependentes(id_pessoa: number, id_dependente: number, body: any) {
        try {
          const {data} = await PessoaService.cadastrarDependente(id_pessoa, id_dependente, body) as { data: PessoaDependenteInterface };
          this.dependente = data
          return data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchDeletarDependente(id_dependente: number) {
        try {
          await PessoaService.deletarDependentes(id_dependente)
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      setModal() {
        this.modal = !this.modal
      },
    },
})
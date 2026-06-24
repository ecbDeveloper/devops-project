import type { PermissaoInterface } from "~/interface/Funcionario/Permissao/PermissaoInterface";
import PermissaoService from "~/service/Funcionario/PermissaoService";

export const usePermissaoStore = defineStore('permissao', {
    state: () => {
        return {
            permissoes: [] as PermissaoInterface[],
        }
    },
    getters: {
        getPermissoes: (state) => state.permissoes,
    },
    actions: {
      async fetchPermissao() {
        try {
          const {data} = await PermissaoService.listar() as { data: PermissaoInterface[] };
          this.permissoes = data
        } catch (e) {
          throw e;
        }
      },

    },
  })
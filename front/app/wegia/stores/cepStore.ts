import type { CepInterface } from "~/interface/Cep/CepInterface";
import CepService from "~/service/CepService";

export const useCepStore = defineStore('cep', {
    state: () => {
        return {
            endereco: {} as CepInterface
        }
    },
    getters: {
        getEndereco: (state) => state.endereco,
    },
    actions: {
      async fetchEndereco(cep: string, formato: string = 'json') {
        try {
          const data = await CepService.getEndereco(cep, formato) as CepInterface
          this.endereco = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      resetEndereco() {
        this.endereco = {} as CepInterface
      }
    },
})
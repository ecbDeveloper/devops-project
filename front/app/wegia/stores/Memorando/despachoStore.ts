import DespachoService from "~/service/Memorando/DespachoService";
import type { DespachoCadastrarInterface } from "~/interface/Memorando/Despacho/DespachoCadastrarInterface";
import type { MemorandoCaixaDeEntradaPaginacaoInterface } from "~/interface/Memorando/MemorandoCaixaDeEntradaPaginacaoInterface";

export const useDespachoStore = defineStore('despacho', {
    state: () => {
      return {
        despachosPaginacao: {} as MemorandoCaixaDeEntradaPaginacaoInterface
      }
    },
    getters: {
      getDespachosPaginacao: (state) => state.despachosPaginacao
    },
    actions: {
      async fetchDespachos() {
        try {
          const { data } = await DespachoService.listar() as { data: MemorandoCaixaDeEntradaPaginacaoInterface };
          this.despachosPaginacao = data
        } catch (e) {
          throw e;
        }
      },
      async fetchCadastrarDespacho(body: FormData | DespachoCadastrarInterface, id: number) {
        try {
          await DespachoService.criarDespacho(body, id);
        } catch (e) {
          throw e;
        }
      },
    },
  })
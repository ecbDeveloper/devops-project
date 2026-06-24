import MemorandoService from "~/service/Memorando/MemorandoService";
import type { MemorandoCadastrarInterface } from "~/interface/Memorando/MemorandoCadastrarInterface";
import type { MemorandoBuscarTodosParamsInterface } from "~/interface/Memorando/MemorandoBuscarTodosParamsInterface";
import type { MemorandoCaixaDeEntradaPaginacaoInterface } from "~/interface/Memorando/MemorandoCaixaDeEntradaPaginacaoInterface";
import type { MemorandoAtualizarInterface } from "~/interface/Memorando/MemorandoAtualizarInterface";
import type { MemorandoInterface } from "~/interface/Memorando/MemorandoInterface";
import { StatusMemorandoEnum } from "@/constants/StatusMemorandoEnum"

export const useMemorandoStore = defineStore('memorando', {
    state: () => {
        return {
          memorandosPaginacao: {} as MemorandoCaixaDeEntradaPaginacaoInterface,
          memorando: {} as MemorandoInterface,
          statusMemorando: StatusMemorandoEnum,
        }
    },
    getters: {
      getMemorandosPaginacao: (state) => state.memorandosPaginacao,
      getMemorando: (state) => state.memorando,
      getStatusOptions: (state) => {
        return Object.entries(state.statusMemorando).map(([key, value]) => ({
          texto: value,
          value: value,
        }));
      }
    },
    actions: {
      async fetchCadastrarMemorando(body: FormData | MemorandoCadastrarInterface) {
        try {
          await MemorandoService.criar(body);
        } catch (e) {
          throw e;
        }
      },
      async fetchMemorandos(params: MemorandoBuscarTodosParamsInterface = {}) {
        try {
          const { data } = await MemorandoService.listar(params) as { data: MemorandoCaixaDeEntradaPaginacaoInterface};
          this.memorandosPaginacao = data
        } catch (e) {
          throw e;
        }
      },
      async fetchMemorandosParticipados(params: MemorandoBuscarTodosParamsInterface = {}) {
        try {
          const { data } = await MemorandoService.listarParticipados(params) as { data: MemorandoCaixaDeEntradaPaginacaoInterface};
          this.memorandosPaginacao = data
        } catch (e) {
          throw e;
        }
      },
      async fetchBuscarPorId(id: number) {
        try {
          const { data } = await MemorandoService.buscarPorId(id) as { data: MemorandoInterface };
          console.log(data)
          this.memorando= data
        } catch (e) {
          throw e;
        }
      },
      async fetchAtualizarMemorando(id: number, body: MemorandoAtualizarInterface) {
        try {
          await MemorandoService.atualizar(id, body)
        } catch (e) {
          throw e;
        }
      }
    },
  })
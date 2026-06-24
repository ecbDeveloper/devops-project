import AvisoService from "~/service/Pessoa/AvisoService";
import type { AvisoPaginacaoInterface } from '@/interface/Pessoa/Aviso/AvisoPaginacaoInterface'
import type { AvisoBuscarTodosParamsInterface } from '@/interface/Pessoa/Aviso/AvisoBuscarTodosParamsInterface'
import type { AvisoInterface } from '@/interface/Pessoa/Aviso/AvisoInterface'

export const useAvisoStore = defineStore('aviso', {
    state: () => {
        return {
          avisosPaginacao: {} as AvisoPaginacaoInterface,
          aviso: {} as AvisoInterface
        }
    },
    getters: {
      getAvisosPaginacao: state => state.avisosPaginacao,
      getAviso: state => state.aviso
    },
    actions: {

      async fetchAvisos(params: Partial<AvisoBuscarTodosParamsInterface>) {
        try {
          const { data } = await AvisoService.listar(params) as { data: AvisoPaginacaoInterface }
          this.avisosPaginacao = data
        } catch (e) {
          throw e;
        }
      },

      async fetchAviso(id: number) {
        try {
          const { data } = await AvisoService.buscarPorId(id) as { data: AvisoInterface }
          this.aviso = data
        } catch (e) {
          throw e;
        }
      },

      async fetchAtualizar(id: number) {
        try {
          await AvisoService.atualizar(id, {})
        } catch (e) {
          throw e;
        }
      },

      setAviso(aviso: AvisoInterface) {
        this.aviso = aviso
      }

    },
  })
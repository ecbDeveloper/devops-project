
import type { FuncionarioDocumentoInterface } from "~/interface/Funcionario/Documento/FuncionarioDocumentoInterface";
import type { FuncionarioDocumentoPaginacaoInterface } from "~/interface/Funcionario/Documento/FuncionarioDocumentoPaginacaoInterface";
import type { FuncionarioDocumentoTipoInterface } from "~/interface/Funcionario/Documento/FuncionarioDocumentoTipoInterface";
import type { FuncionarioRemuneracaoTipoInterface } from "~/interface/Funcionario/Remuneracao/FuncionarioRemuneracaoTipoInterface";
import FuncionarioService from "~/service/FuncionarioService";

export const useDocumentoStore = defineStore('documento', {
    state: () => {
        return {
            documentos: {} as FuncionarioDocumentoPaginacaoInterface,
            documento: {} as FuncionarioDocumentoInterface,
            tipoDocumentos: [] as FuncionarioDocumentoTipoInterface[],
            modalAberto: false as Boolean,
            modalTipoAberto: false as Boolean,
        }
    },
    getters: {
        getDocumentos: (state) => state.documentos,
        getDocumento: (state) => state.documento,
        getTipoDocumentos: (state) => state.tipoDocumentos,
        getTipoDocumentosParaSelect: (state) => {
          return state.tipoDocumentos.map(r => {
            return {
              texto: r.nome_docfuncional,
              value: r.id_docfuncional
            }
          })
        },
        getModalAberto: (state) => state.modalAberto,
        getModalTipoAberto: (state) => state.modalTipoAberto
    },
    actions: {
      async fetchDocumentos(id_funcionario: number, params: { [key: string]: string | number } = {}) {
        try {
          const queryString = new URLSearchParams(params).toString();

          const {data} = await FuncionarioService.buscarDocumentos(id_funcionario, queryString) as { data: FuncionarioDocumentoPaginacaoInterface };
          this.documentos = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchCadastrarDocumento(body: {arquivo: File, id_docfuncional: number}, id_funcionario: number) {
        try {
          const {data} = await FuncionarioService.cadastrarDocumento(body, id_funcionario) as { data: FuncionarioDocumentoInterface };
          this.documento = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchDeletarDocumento(id_documento: number) {
        try {
          const data = await FuncionarioService.deletarDocumento(id_documento) as { data: Boolean };
          return data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchTipoDocumento() {
        try {
          const {data} = await FuncionarioService.buscarTipoDocumentos() as { data: FuncionarioDocumentoTipoInterface[] };
          this.tipoDocumentos = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      async fetchCadastrarTipoDocumento(body: {nome_docfuncional: string, descricao_docfuncional: string | null}) {
        try {
          const {data} = await FuncionarioService.cadastrarTipoDocumento(body) as { data: FuncionarioDocumentoTipoInterface };
          this.tipoDocumentos.push(data)
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
import type { PessoaInterface } from "~/interface/Pessoa/PessoaInterface"
import type { PessoaAtualizarSenhaInterface } from "~/interface/Pessoa/PessoaAtualizarSenhaInterface"
import PessoaService from "~/service/PessoaService"

export const usePessoaStore = defineStore('pessoa', {
    state: () => {
        return {
            pessoa: {} as PessoaInterface | null,
            pessoaPorCpf: {} as PessoaInterface,
            pessoaCadastrada: {} as PessoaInterface,
            pessoaParaFiltro: [] as PessoaInterface[],
            carregandoMe: true,
        }
    },
    getters: {
      getPessoa: (state) => state.pessoa,
      getPessoaPorCpf: (state) => state.pessoaPorCpf,
      getPessoaCadastrada: (state) => state.pessoaCadastrada,
      getPessoaParaFiltro: (state) => state.pessoaParaFiltro.map(p => {
        return {
          value: p.id_pessoa,
          texto: p.nome
        }
      }),
      getCarregandoMe: (state) => state.carregandoMe
    },
    actions: {
      async fetchPessoa(body) {
        try {
          const { data } = await PessoaService.criarPessoa(body) as { data: PessoaInterface };
          this.pessoaCadastrada = data
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchMe(withParam: String = '') {
        try {
          this.carregandoMe = true
          const { data } = await PessoaService.getMe(withParam) as { data: PessoaInterface };
          this.pessoa = data
        } catch (e) {
          console.log(e)
          throw e;
        } finally {
          this.carregandoMe = false
        }
      },
      async fetchPorCpf(cpf: string) {
        try {
          const { data } = await PessoaService.getPessoaPorCpf(cpf) as { data: PessoaInterface };
          this.pessoaPorCpf = data
        } catch (e: any) {
          throw e;
        }
      },
      async fetchParaFiltro() {
        try {
          const { data } = await PessoaService.getPessoaParaFiltro() as { data: PessoaInterface[] };
          this.pessoaParaFiltro = data
        } catch (e: any) {
          throw e;
        }
      },
      async fetchAtualizarPessoa(body, id_pessoa: number) {
        try {
          await PessoaService.putPessoa(body, id_pessoa)
        } catch (e) {
          console.log(e)
          throw e;
        }
      },
      async fetchAtualizarPropriaSenha(body: PessoaAtualizarSenhaInterface) {
        try {
          await PessoaService.atualizarPropriaSenha(body);
        } catch (e) {
          throw e;
        }
      },
      async fetchAtualizarSenhaDeOutraPessoa(id: number, body: PessoaAtualizarSenhaInterface) {
        try {
          await PessoaService.atualizarSenhaDeOutraPessoa(id, body);
        } catch (e) {
          throw e;
        }
      },
      async fetchAtualizarImagemPessoa(body, id_pessoa: number) {
        try {
          const { data } = await PessoaService.atualizarImagemPessoa(body, id_pessoa) as { data: PessoaInterface };
        } catch (e) {
          console.log(e)
          throw e;
        }
      },

      removerAviso(id_aviso: number) {
        if(this.pessoa?.avisos) {
          this.pessoa.avisos = this.pessoa.avisos.filter(aviso => aviso.id_aviso !== id_aviso);
        }
      },

      setPessoa(pessoa: PessoaInterface | null) {
        this.pessoa = pessoa
      },

      setPessoaPorCpf(pessoa: PessoaInterface = {} as PessoaInterface) {
        this.pessoaPorCpf = pessoa
      },

      possuiPermissao(permissao: string) {
        if(!this.pessoa?.funcionario?.perfil) return false

        return this.pessoa?.funcionario?.perfil?.permissoes?.some(p => FormatString.slugify(p.nome) === FormatString.slugify(permissao))
      }
    },
  })
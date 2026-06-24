export const usePerfilStore = defineStore('perfil', {
    state: () => {
        return {
          perfis: [] as PerfilInterface[],
          perfilPermissao: {} as PerfilInterface,
          modalNovoPerfil: false as Boolean
        }
    },
    getters: {
      getPerfisSelect: (state) => state.perfis.map(p => ({
        value: p.id_perfil,
        texto: p.nome
      })),
      getModalNovoPerfil: (state) => state.modalNovoPerfil
    },
    actions: {
      async fetchCadastrarPerfil(body: PerfilCadastrarInterface) {
        try {
          const {data} = await PerfilService.criar(body) as { data: PerfilInterface };
          this.perfis.push(data)
        } catch (e) {
          throw e;
        }
      },

      async fetchPerfis() {
        try {
          const {data} = await PerfilService.listar() as { data: PerfilInterface[] };
          this.perfis = data
        } catch (e) {
          throw e;
        }
      },
      async fetchPermissaoPerfil(id: number) {
        try {
          const {data} = await PerfilService.permissao(id) as { data: PerfilInterface };
          this.perfilPermissao = data
        } catch (e) {
          throw e;
        }
      },

      async fetchSincronizarPermissao(id: number, body: PerfilPermissaoSincronizarInterface) {
        try {
          await PerfilService.sincronizarPermissao(id, body);
        } catch (e) {
          throw e;
        }
      },

      toggleModalNovoPerfil() {
        this.modalNovoPerfil = !this.modalNovoPerfil
      }

    },
  })
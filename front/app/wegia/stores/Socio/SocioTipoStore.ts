export const useSocioTipoStore = defineStore('socioTipoStore', {
  state: () => {
    return {
      tipos: [] as SocioTipoInterface[],
      tipoPessoa: null as 'Física' | 'Jurídica' | null,
      periodicidade: null as string | null
    }
  },

  getters: {
    getTipos: (state) => state.tipos,

    getTipoPessoa: (state) => state.tipoPessoa,

    getPeriodicidade: (state) => state.periodicidade,

    tiposPeriocidade: (state) => {

      const lista = state.tipos
        .filter(tipo => {
          if (state.tipoPessoa && !tipo.tipo.includes(state.tipoPessoa)) return false

          const partes = tipo.tipo.split(' - ')
          if (partes.length < 3) return false

          return true
        })
        .map(g => {
          const partes = g.tipo.split(' - ')
          return partes[1]?.trim() || null
        })
        .filter((v): v is string => !!v)

      const unicos = [...new Set(lista)]

      return unicos.map(valor => ({
        value: valor,
        texto: valor
      }))
    },

    tiposContribuicao: (state) => {
      if (!state.periodicidade) {
        return []
      }

      const lista = state.tipos
        .filter(tipo => {
          if (state.tipoPessoa && !tipo.tipo.includes(state.tipoPessoa)) return false
          if (state.periodicidade && !tipo.tipo.includes(state.periodicidade)) return false

          const partes = tipo.tipo.split(' - ')
          if (partes.length < 3) return false

          return true
        })
        .map(tipo => {
          const partes = tipo.tipo.split(' - ')
          return partes[2]?.trim() || null
        })
        .filter((v): v is string => !!v)

      const unicos = [...new Set(lista)]

      return unicos.map(valor => ({
        value: valor,
        texto: valor
      }))
    },
  },

  actions: {
    async fetchTiposFiltro() {
      try {
          const { data } = await SocioTipoService.filtro() as { data: SocioTipoInterface[] };
          this.tipos = data;
      } catch (e) {
          throw e;
      }
    },

    encontrarTipo(periodicidade: string, contribuicao: string) {
      if (!this.tipoPessoa) return null

      return this.tipos.find(t => {
        const partes = t.tipo.split(' - ')
        if (partes.length < 3) return false

        return (
          partes[0] === this.tipoPessoa &&
          partes[1] === periodicidade &&
          partes[2] === contribuicao
        )
      }) || null
    },

    setTipoPessoa(tipo: 'Física' | 'Jurídica' | null) {
      this.tipoPessoa = tipo
    },

    setPeriodicidade(periodicidade: string | null) {
      this.periodicidade = periodicidade
    }

  },
})

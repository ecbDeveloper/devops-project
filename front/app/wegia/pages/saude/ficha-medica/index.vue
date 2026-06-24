<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_FICHA_MEDICA)">Você não possui permissão!</h2>
  <section class="saude-ficha-medica">

    <ListaDeDados
      titulo="Ficha Médica"
      class="lista-saude-ficha-medica"
    >

      <div class="filtros">
        <div class="filtro-busca">
            <InputText
                v-model="buscar"
                placeholder="Search"
            />
            <Butao texto="Filtrar" @click-botao="buscarFichaMedica" />
        </div>
      </div>

      <Loading v-if="isLoading" />

      <Tabela
          v-else
          :cabecalhos="[
              { nome: 'Nome', chave: 'nome', ordenavel: true },
              { nome: 'Acoes', chave: 'acao', ordenavel: false },
          ]"
          :acao="['editar']"
          :linhas="fichasMedica"
          :orderBy="orderBy"
          :tipoOrderBy="tipoOrderBy"
          @atualizar-orderBy="atualizarOrderBy"
          @editar="navegarParaMedicamento"
      />


      <div class="paginacao">
          <p>{{ paginacaoTexto }}</p>

          <div class="paginador">
              <Paginador
                  :paginaAtual="paginaAtual"
                  :ultimaPagina="ultimaPagina"
                  @atualizar-pagina="atualizarPaginaAtual"
              />
          </div>

          <div class="select-itens">
              <InputSelect
                  @select-change="buscarFichaMedica"
                  v-model="itensPorPagina"
                  :opcoes="[
                      { texto: '10', value: 10 },
                      { texto: '25', value: 25 },
                      { texto: '50', value: 50 },
                      { texto: '100', value: 100 }
                  ]"
              />
              <span>Itens Por Página</span>
          </div>
      </div>


    </ListaDeDados>

  </section>

</template>

<script setup lang="ts">

  definePageMeta({
    middleware: ['permissao'],
    permission: Permissao.VISUALIZAR_FICHA_MEDICA
  })

  const router = useRouter()
  const pessoaStore = usePessoaStore()
  const menuSectionStore = useMenuSectionStore()
  const saudeFichaMedicaStore = useSaudeFichaMedicaStore()

  menuSectionStore.setTitulo("Lista de Ficha médica")
  menuSectionStore.setComplemento("Ficha medica")

  const itensPorPagina = ref(10)
  const paginaAtual = ref(1)
  const ultimaPagina = ref(1)
  const totalItens = ref(0)
  const buscar = ref('')
  const orderBy = ref('')
  const tipoOrderBy = ref('')
  const isLoading = ref(true)

  const fichasMedica = computed(() => {
    if(saudeFichaMedicaStore.getFichasMedica.items.length == 0) return []

    return saudeFichaMedicaStore.getFichasMedica.items.map(item => {
      return {
        ...item,
        nome: item.pessoa.nome,
      }
    })
  })

  const atualizarOrderBy = async (value: { orderBy: string, tipoOrderBy: string }) => {
    orderBy.value = value.orderBy
    tipoOrderBy.value = value.tipoOrderBy
    await buscarFichaMedica()
  }

  const buscarFichaMedica = async () => {
    isLoading.value = true
    const params: Partial<SaudeFichaMedicaBuscarTodosParamsInterface> = {}

    params.itensPorPagina                      = itensPorPagina.value
    params.pagina                              = paginaAtual.value
    if(buscar.value) params.buscar             = buscar.value
    if(orderBy.value) params.ordenacao         = orderBy.value
    if(tipoOrderBy.value) params.tipoOrdenacao = tipoOrderBy.value

    await saudeFichaMedicaStore.fetchFichaMedica(params).then(() => {
      const fichasMedica = saudeFichaMedicaStore.getFichasMedica

      paginaAtual.value = fichasMedica.paginaAtual
      itensPorPagina.value = fichasMedica.itensPorPagina
      ultimaPagina.value = fichasMedica.totalPaginas
      totalItens.value = fichasMedica.totalItens
    })
    isLoading.value = false
  }

  const paginacaoTexto = computed(() => {
    const total = totalItens.value || 0
    const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1
    const fim = Math.min(paginaAtual.value * itensPorPagina.value, total)
    return `Showing ${inicio} to ${fim} of ${total} entries`
  })

  const atualizarPaginaAtual = async (novaPagina: number) => {
    if (novaPagina !== paginaAtual.value) {
      paginaAtual.value = novaPagina
      await buscarFichaMedica()
    }
  }

  const navegarParaMedicamento = (value : {id_fichamedica: number}) => {
    router.push(`/saude/ficha-medica/${value.id_fichamedica}`)
  }

  onMounted(async () => {
    await buscarFichaMedica()
  })

</script>


<style lang="scss" scoped>

  .saude-ficha-medica{
    padding: 48px;

    .lista-saude-ficha-medica {
      .filtros {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .filtro-busca {
        align-items: center;
        display: flex;
        gap: 8px;

        button {
          width: 90px;
          height: 48px;
        }
      }

      .input, .input-select {
        margin-bottom: 0px;
      }

      input {
        width: 25%;
      }
    }

    .paginacao {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin-top: 24px;

      .paginador {
        margin: 0 auto;
      }

      .select-itens {
        justify-self: end;
      }
    }
    }
  }

</style>

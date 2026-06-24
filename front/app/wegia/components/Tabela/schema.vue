<template>

  <section class="tabela-schema">

    <ListaDeDados
      :titulo="titulo"
      class="lista-saude-ficha-medica"
    >

      <div class="botoes">
        <slot name="botoes" />
      </div>

      <div class="filtros" v-if="mostrarFiltros">

        <button class="filtro-abrir-mobile" @click="toggleFiltros">
          <i class="fas fa-sliders-h"></i>
        </button>

        <div v-if="abrirModal" class="overlay" @click="toggleFiltros"></div>

        <div
          class="filtros-container"
          :class="{'filtros-mobile': abrirModal}"
        >

          <i v-if="abrirModal" class="fas fa-times" @click="toggleFiltros" />

          <slot name="filtro" />

          <div class="filtro-busca">
              <InputText
                  v-model="buscar"
                  placeholder="Search"
              />
              <Butao texto="Filtrar" @click-botao="buscarDados" />
          </div>

          <input-select
            v-if="abrirModal && opcoesOrdenacao.length"
            v-model="orderBy"
            opcaoDefault="Sem ordenação"
            :opcoes="opcoesOrdenacao"
            @select-change="buscarDados"
          />

          <input-select
            v-if="abrirModal && opcoesOrdenacao.length"
            v-model="tipoOrderBy"
            opcaoDefault="Sem ordenação"
            :opcoes="[
              { texto: 'Decrescente', value: 'desc'},
              { texto: 'Crescente', value: 'asc'},
            ]"
            @select-change="buscarDados"
          />
        </div>

      </div>

      <loading v-if="isLoading" />

      <div
        v-else
        class="tabela-container-scroll"
        :style="habilitarScroll ? {
          maxHeight: alturaMaximaTabela,
          overflowY: 'auto',
          overflowX: 'auto'
        } : {}"
      >
        <tabela
          :cabecalhos="cabecalhos"
          :acao="acao"
          :linhas="linhas"
          :orderBy="orderBy"
          :tipoOrderBy="tipoOrderBy"
          @atualizar-orderBy="atualizarOrderBy"
          @editar="(linha: any) => emit('editar', linha)"
          @baixar="(linha: any) => emit('baixar', linha)"
          @excluir="(linha: any) => emit('excluir', linha)"
          @click-linha="(linha: any) => emit('click-linha', linha)"
        >
          <template #acao="{ linha }">
            <slot name="acao" :linha="linha" />
          </template>

        </tabela>
      </div>


      <div class="paginacao" v-if="mostrarPaginacao">
          <p>{{ mostrarTextoPaginacao ? paginacaoTexto : '' }}</p>

          <div class="paginador">
              <Paginador
                v-if="paginacao"
                  :paginaAtual="paginaAtual"
                  :ultimaPagina="paginacao.totalPaginas"
                  @atualizar-pagina="atualizarPaginaAtual"
              />
          </div>

          <div class="select-itens">
              <InputSelect
                  @select-change="buscarDados"
                  v-model="itensPorPagina"
                  :opcoes="opcoes"
              />
              <span>Itens Por Página</span>
          </div>
      </div>


    </ListaDeDados>

  </section>

</template>

<script setup lang="ts">

  const props = withDefaults(defineProps<{
    titulo: string
    paginacao?: PaginacaoInterface | null
    opcoes?: { texto: string, value: any }[]
    cabecalhos: { nome: string, chave: string, ordenavel: boolean }[]
    linhas: any[]
    acao?: string[]
    orderByStart?: string
    tipoOrderByStart?: 'asc' | 'desc' | 'ASC' | 'DESC'
    isLoading?: boolean
    atualizacao?: number
    mostrarPaginacao?: boolean
    mostrarFiltros?: boolean
    mostrarTextoPaginacao?: boolean
    habilitarScroll?: boolean
    alturaMaximaTabela?: string
  }>(), {
    acao: () => [],
    opcoes: () => [
      { texto: '10', value: 10 },
      { texto: '25', value: 25 },
      { texto: '50', value: 50 },
      { texto: '100', value: 100 }
    ],
    isLoading: false,
    mostrarPaginacao: true,
    mostrarFiltros: true,
    mostrarTextoPaginacao: true,
    paginacao: null,
    atualizacao: 0,
    habilitarScroll: false,
    alturaMaximaTabela: '500px'
  })

  const emit = defineEmits(['buscar', 'editar', 'baixar', 'excluir', 'click-linha'])

  const buscar = ref('')
  const orderBy = ref(props.orderByStart ?? '')
  const tipoOrderBy = ref(props.tipoOrderByStart ?? 'asc')
  const itensPorPagina = ref(props.paginacao?.itensPorPagina ?? 10)
  const paginaAtual = ref(props.paginacao?.paginaAtual ?? 1)
  const abrirModal = ref(false)

  const paginacaoTexto = computed(() => {
    if(props.paginacao) {
      const total = props.paginacao?.totalItens || 0
      const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1
      const fim = Math.min(paginaAtual.value * itensPorPagina.value, props.paginacao?.totalItens)
      return `Showing ${inicio} to ${fim} of ${total} entries`
    }
    return ''
  })

  const opcoesOrdenacao = computed(() => {
  return props.cabecalhos
    .filter(c => c.ordenavel)
    .map(c => ({
      texto: c.nome,
      value: c.chave
    }))
})

  const atualizarOrderBy = async (value: { orderBy: string, tipoOrderBy: 'asc' | 'desc' | 'ASC' | 'DESC' }) => {
    orderBy.value = value.orderBy
    tipoOrderBy.value = value.tipoOrderBy
    buscarDados()
  }

  const atualizarPaginaAtual = async (novaPagina: number) => {
    if (novaPagina !== paginaAtual.value) {
      paginaAtual.value = novaPagina
      buscarDados()
    }
  }

  const buscarDados = () => {
    emit('buscar', {
      buscar: buscar.value,
      pagina: paginaAtual.value,
      itensPorPagina: itensPorPagina.value,
      ordenacao: orderBy.value,
      tipoOrdenacao: tipoOrderBy.value
    })
  }

  const toggleFiltros = () => { abrirModal.value = !abrirModal.value}

  watch(() => props.atualizacao, (newVal) => {
    buscarDados()
  })

</script>


<style lang="scss" scoped>

  .tabela-schema{
    padding: 48px;

    .lista-saude-ficha-medica {
      overflow-x: auto;

      .botoes {
        margin-bottom: 16px;
        display: flex;
        gap: 8px;
      }

      .tabela-container-scroll {
        border: 1px solid #e0e0e0;
        border-radius: 8px;

        &::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;

          &:hover {
            background: #555;
          }
        }
      }

      .filtros {
        display: flex;
        justify-content: end;
        margin-bottom: 8px;

        @include lg {
          display: block;
        }

        .filtro-abrir-mobile {
          background-color: $color-white;
          border-radius: 16px;
          display: block;
          height: 64px;
          width: 64px;

          @include lg {
            display:none;
          }
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          z-index: 98;
        }

        .filtros-container.filtros-mobile {
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          right: 0;
        }

        .filtros-container {
          background: $color-white;
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: 100vh;
          padding: 48px 16px;
          position: fixed;
          right: -130%;
          top: 0%;
          transition: right 0.3s ease-in-out;
          z-index: 99;


          @include lg{
            background: none;
            align-items: center;
            flex-direction: row;
            height: auto;
            justify-content: space-between;
            padding: 0px;
            right: 0;
            position: relative;
          }

          .fa-times {
            align-self: flex-end;
          }

          .filtro-busca {
            align-items: center;
            display: flex;
            gap: 8px;
            margin-left: auto;

            button {
              height: 48px;
              width: 90px;
            }
          }


          input {
            width: 25%;
          }

          :deep(.input-select),
          :deep(.input)  {
            margin-bottom: 0px;
          }
        }


      }

    .paginacao {
      display: grid;
      grid-template-columns: 1fr;
      margin: 16px auto auto;
      gap: 8px;

      p {
        margin: auto;
        width: fit-content;

        @include md {
          margin: 0px;
        }
      }

      @include md {
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 24px;
        gap: 0px
      }

      .paginador {
        margin: 0 auto;
      }

      .select-itens {

        @include md {
          justify-self: end;
        }
      }
    }
    }
  }

</style>
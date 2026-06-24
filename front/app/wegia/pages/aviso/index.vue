<template>
  <section class="avisos">

      <ListaDeDados
          titulo="Avisos"
          class="lista-de-avisos"
      >
          <FiltroPrimario
              :itensPorPaginaArray="itensPorPaginaArray"
              :itensPorPagina="itensPorPagina"
              :busca="buscar"
              :selectArray="statusOpcoes"
              :select="status"
              @atualizar-filtros="atualizarFiltrosMobile"
              class="filtro-mobile"
          />

          <div class="filtros">

              <InputSelect
                  v-model="status"
                  :opcoes="statusOpcoes"
                  @select-change="buscarAvisos"
              />

              <div class="filtro-busca">
                  <InputText
                      v-model="buscar"
                      placeholder="Buscar pelo titulo do aviso"
                  />
                  <Butao texto="Filtrar" @click-botao="buscarAvisos" />
              </div>
          </div>

          <Loading v-if="isLoading" />

          <Tabela
              v-else
              :cabecalhos="cabecalho"
              :linhas="avisos"
              @click-linha="navegarParaAviso"
          >

            <template #nivel="{ linha }: any">
                <span
                    class="status-tag"
                    :class="{
                        'info': linha.nivel === 'info',
                        'alerta': linha.nivel === 'alerta',
                        'erro': linha.nivel === 'erro',
                    }"
                >
                    {{ linha.nivel }}
                </span>
            </template>

          </Tabela>

          <div class="paginacao">
              <p>{{ paginacaoTexto }}</p>

              <div class="paginador">
                  <Paginador
                      :paginaAtual=paginaAtual
                      :ultimaPagina=ultimaPagina
                      @atualizar-pagina="atualizarPaginaAtual"
                  />
              </div>

              <div class="select-itens">
                  <InputSelect
                      @select-change="buscarAvisos"
                      v-model="itensPorPagina"
                      :opcoes="itensPorPaginaArray"
                  />
                  <span>Itens Por Página</span>
              </div>
          </div>
      </ListaDeDados>

  </section>

</template>

<script setup lang="ts">

import type { AvisoPaginacaoInterface } from '@/interface/Pessoa/Aviso/AvisoPaginacaoInterface'
import type { AvisoBuscarTodosParamsInterface } from '@/interface/Pessoa/Aviso/AvisoBuscarTodosParamsInterface'
import type { AvisoInterface } from '@/interface/Pessoa/Aviso/AvisoInterface'

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const avisoStore = useAvisoStore()

menuSectionStore.setTitulo("Avisos")
menuSectionStore.setComplemento("")

const itensPorPaginaArray = ref([
  {texto: '10', value: 10},
  {texto: '25', value: 25},
  {texto: '50', value: 50},
  {texto: '100', value: 100},
])

const cabecalho = ref([
  {nome: 'Titulo', chave: 'titulo', ordenavel: false},
  {nome: 'Data', chave: 'data_criacao', ordenavel: false},
  {nome: 'Status', chave: 'nivel', ordenavel: false}
])

const itensPorPagina = ref(10)
const status = ref('true')
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const isLoading = ref(true)

const statusOpcoes = ref([
  {texto: 'Ativo', value: 'true'},
  {texto: 'Inativo', value: 'false'}
])

const avisos = computed(() => {
  const valores = avisoStore.getAvisosPaginacao

  if(!valores?.items?.length || isLoading.value) return []

  return valores.items
})

const paginacaoTexto = computed(() => {
  const total = totalItens.value || 0;
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1;
  const fim = Math.min(paginaAtual.value * itensPorPagina.value, total);
  return `Showing ${inicio} to ${fim} of ${total} entries`;
});

const atualizarPaginadorCompleto = (value: AvisoPaginacaoInterface) => {
  paginaAtual.value = value.paginaAtual
  itensPorPagina.value = value.itensPorPagina
  ultimaPagina.value = value.totalPaginas
  totalItens.value = value.totalItens
}

const buscarAvisos = async () => {

  isLoading.value = true
  const params : Partial<AvisoBuscarTodosParamsInterface> = {}

  if(status.value.length > 3) params.ativo = status.value
  if(buscar.value) params.titulo = buscar.value
  if(paginaAtual.value) params.pagina = paginaAtual.value
  if(itensPorPagina.value) params.itensPorPagina = itensPorPagina.value

  await avisoStore.fetchAvisos(params).then(() => {
    const a: AvisoPaginacaoInterface = avisoStore.getAvisosPaginacao
    atualizarPaginadorCompleto(a)
  })

  isLoading.value = false
}


const atualizarPaginaAtual = async (novaPagina: number) => {
  if(novaPagina !== paginaAtual.value) {
      paginaAtual.value = novaPagina;
      await buscarAvisos()
  }
};

const atualizarFiltrosMobile = async (filtros: any) => {
  status.value = filtros.select
  buscar.value = filtros.busca
  itensPorPagina.value = filtros.itensPorPagina

  await buscarAvisos()
}


const navegarParaAviso = (value : AvisoInterface) => {
    avisoStore.setAviso(value)
    router.push(`/aviso/${value.id_aviso}`)
}

buscarAvisos()

</script>

<style scoped lang="scss">

.avisos {
  padding: 48px;

    .lista-de-avisos {

        .filtro-mobile {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;

            @include md {
                display: none;
            }
        }

      .filtros {
            display: none;
            justify-content: space-between;
            margin-bottom: 8px;

            @include md {
                display: flex;
            }

            .filtro-busca {
                align-items: center;
                display: flex;
                gap: 8px;

                button {
                    width: 90px;
                    height: 48px;
                }
            }

            .input {
                margin-bottom: 0px;
            }

            .input-select {
                margin-bottom: 0px;
            }

            input {
                width: 25%;
            }
        }

        .paginacao {
          display: grid;
          margin-top: 24px;

            @include md {
                grid-template-columns: 1fr 1fr 1fr;
            }

            p {
                display: none;

                @include md {
                    display: block;
                }
            }

            .paginador {
                margin: 0 auto;
            }

            .select-itens {
                display: none;
                justify-self: end;

                @include md {
                    display: block;
                }
            }
        }

        .botoes {
            display: flex;
            gap: 8px;

            .status-btn {
                align-items: center;
                background-color: $color-white;
                border: none;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba($color-black, 0.1);
                color: $color-senary;
                cursor: pointer;
                display: flex;
                font-size: 16px;
                justify-content: center;
                padding: 8px 10px;
                transition: all 0.2s ease-in-out;



                &.info {
                    color: $color-primary;

                    &:hover {
                        background-color: rgba( $color-primary, 0.1);
                    }
                }

                &.erro {
                    color: $color-error;

                    &:hover {
                        background-color: rgba( $color-error, 0.1);
                    }
                }

                &.alerta {
                    color: $color-warning;

                    &:hover {
                        background-color: rgba($color-warning, 0.1);
                    }
                }
            }
        }

        .status-tag {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            text-align: center;

            &.info {
                background-color: rgba($color-senary, 0.1);
                color: $color-senary;
            }

            &.erro {
                background-color: rgba($color-error, 0.1);
                color: $color-error;
            }

            &.alerta {
                background-color: rgba($color-warning, 0.1);
                color: $color-warning;
            }
        }
  }
}

</style>
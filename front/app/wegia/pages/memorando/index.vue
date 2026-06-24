<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_MEMORANDO)">Você não possui permissão!</h2>
  <section class="memorando" v-else>

      <ListaDeDados
          titulo="Memorandos"
          class="lista-de-memorando"
      >
          <FiltroPrimario
              :itensPorPaginaArray="itensPorPaginaArray"
              :itensPorPagina="itensPorPagina"
              :busca="buscar"
              :orderByArray="cabecalho"
              :orderBy="orderBy"
              :tipoOrderBy="tipoOrderBy"
              :selectArray="statusOpcoes"
              :select="status"
              @atualizar-filtros="atualizarFiltrosMobile"
              class="filtro-mobile"
          />

          <div class="filtros">

              <InputSelect
                  v-model="status"
                  :opcoes="statusOpcoes"
                  @select-change="buscarMemorando"
              />

              <div class="filtro-busca">
                  <InputText
                      v-model="buscar"
                      placeholder="Search"
                  />
                  <Butao texto="Filtrar" @click-botao="buscarMemorando" />
              </div>
          </div>

          <Loading v-if="isLoading" />

          <Tabela
              v-else
              :cabecalhos="cabecalho"
              :linhas="memorandos"
              :orderBy="orderBy"
              :tipoOrderBy="tipoOrderBy"
              @atualizar-orderBy="atualizarOrderBy"
              @click-linha="navegarParaMemorando"
          >
            <template #acao="{linha}: any">
                <div class="botoes" role="group" aria-label="Ações da linha" v-if="linha.status_memorando !== 'Arquivado'">
                    <button
                        v-for="(botao, index) in filtrarBotoes(linha)"
                        :key="index"
                        :title="botao.titulo"
                        :class="botao.class"
                        :aria-pressed="false"
                        @click.stop="() => marcarStatus(linha, botao.click)"
                    >
                        <i :class="botao.icone"></i>
                    </button>

                    <button
                        v-if="linha.criado_por == pessoaLogada?.id_pessoa"
                        title="Arquivado"
                        class="status-btn arquivado"
                        :aria-pressed="false"
                        @click.stop="() => marcarStatus(linha, 'Arquivado')"
                    >
                        <i class="fa-solid fa-box-archive"></i>
                    </button>
                </div>
            </template>

            <template #status_memorando="{ linha }: any">
                <span
                    class="status-tag"
                    :class="{
                        'nao-lido': linha.status_memorando === 'Não Lido',
                        'lido': linha.status_memorando === 'Lido',
                        'importante': linha.status_memorando === 'Importante',
                        'pendente': linha.status_memorando === 'Pendente',
                        'arquivado': linha.status_memorando === 'Arquivado'
                    }"
                >
                    {{ linha.status_memorando }}
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
                      @select-change="buscarMemorando"
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

import type { MemorandoBuscarTodosParamsInterface } from '~/interface/Memorando/MemorandoBuscarTodosParamsInterface';
import type { MemorandoCaixaDeEntradaPaginacaoInterface } from '~/interface/Memorando/MemorandoCaixaDeEntradaPaginacaoInterface';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MEMORANDO
})

const router = useRouter();
const memorandoStore = useMemorandoStore()
const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

menuSectionStore.setTitulo("Memorandos")
menuSectionStore.setComplemento("")

const itensPorPaginaArray = ref([
  {texto: '10', value: 10},
  {texto: '25', value: 25},
  {texto: '50', value: 50},
  {texto: '100', value: 100},
])

const cabecalho = ref([
    {nome: 'Titulo', chave: 'titulo', ordenavel: true},
    {nome: 'Origem', chave: 'origem', ordenavel: true},
    {nome: 'Data', chave: 'data', ordenavel: true},
    {nome: 'Status', chave: 'status_memorando', ordenavel: true},
    {nome: 'Acao', chave: 'acao', ordenavel: false},
])

const botoes = computed(() => {

    if(!pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MEMORANDO)) return []

    return [
        { titulo: "Não Lido", class: 'status-btn nao-lido', click: 'Não Lido', icone: 'fa-regular fa-envelope'},
        { titulo: "Lido", class: 'status-btn lido', click: 'Lido', icone: 'fa-regular fa-envelope-open'},
        { titulo: "Importante", class: 'status-btn importante', click: 'Importante', icone: 'fa-solid fa-circle-exclamation'},
        { titulo: "Pendente", class: 'status-btn pendente', click: 'Pendente', icone: 'fa-regular fa-clock'},
    ]
})

const itensPorPagina = ref(10)
const status = ref('')
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('')
const tipoOrderBy = ref('')
const isLoading = ref(true)

const statusOpcoes = computed(() => memorandoStore.getStatusOptions)
const pessoaLogada = computed(() => pessoaStore.getPessoa)

const memorandos = computed(() => {
  const m = memorandoStore.getMemorandosPaginacao

  if(!m?.items?.length || isLoading.value) return []

  return m.items
})

const paginacaoTexto = computed(() => {
  const total = totalItens.value || 0;
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1;
  const fim = Math.min(paginaAtual.value * itensPorPagina.value, total);
  return `Showing ${inicio} to ${fim} of ${total} entries`;
});

const atualiazarPaginadorCompleto = (f: MemorandoCaixaDeEntradaPaginacaoInterface) => {
  paginaAtual.value = f.paginaAtual
  itensPorPagina.value = f.itensPorPagina
  ultimaPagina.value = f.totalPaginas
  totalItens.value = f.totalItens
}

const buscarMemorando = async () => {

  isLoading.value = true
  const params : Partial<MemorandoBuscarTodosParamsInterface> = {}
  params.destinatario = true

  if(status.value.length > 3) params.status = status.value
  if(orderBy.value) params.ordenacao = orderBy.value
  if(tipoOrderBy.value) params.tipoOrdenacao = tipoOrderBy.value
  if(buscar.value) params.buscar = buscar.value
  if(paginaAtual.value) params.pagina = paginaAtual.value
  if(itensPorPagina.value) params.itensPorPagina = itensPorPagina.value

  await memorandoStore.fetchMemorandos(params).then(() => {
    const m = memorandoStore.getMemorandosPaginacao
    atualiazarPaginadorCompleto(m)
  })

  isLoading.value = false
}

const atualizarOrderBy = async (value : {orderBy: string, tipoOrderBy: string}) => {
  orderBy.value = value.orderBy
  tipoOrderBy.value = value.tipoOrderBy
  await buscarMemorando()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
  if(novaPagina !== paginaAtual.value) {
      paginaAtual.value = novaPagina;
      await buscarMemorando()
  }
};

const atualizarFiltrosMobile = async (filtros: any) => {
  status.value = filtros.select
  buscar.value = filtros.busca
  itensPorPagina.value = filtros.itensPorPagina
  orderBy.value = filtros.orderBy
  tipoOrderBy.value = filtros.tipoOrderBy

  await buscarMemorando()
}

const filtrarBotoes = (linha: any) => {
    return botoes.value.filter(botao => botao.titulo !== linha.status_memorando);
}

const marcarStatus = async (linha: any, status: string) => {
    const json = {
        status_memorando: status
    }

    try {
        await memorandoStore.fetchAtualizarMemorando(linha.id_memorando, json)
        alertStore.mostrarAlerta('success', 'Memorando atualizado com sucesso!')

        buscarMemorando()
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao atualizar Memorando!')
        console.log(e)
    }
};

const navegarParaMemorando = (value : {id_memorando: number}) => {
  router.push(`/memorando/${value.id_memorando}`)
}

buscarMemorando()

</script>

<style scoped lang="scss">

.memorando {
    padding: 12px;

    @include lg {
        padding: 48px;
    }

    .lista-de-memorando {

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


                &.lido {
                    color: $color-success;

                    &:hover {
                        background-color: rgba( $color-success, 0.1);
                    }
                }

                &.nao-lido {
                    color: $color-primary;

                    &:hover {
                        background-color: rgba( $color-primary, 0.1);
                    }
                }

                &.importante {
                    color: $color-error;

                    &:hover {
                        background-color: rgba( $color-error, 0.1);
                    }
                }

                &.pendente {
                    color: $color-warning;

                    &:hover {
                        background-color: rgba($color-warning, 0.1);
                    }
                }

                &.imprimir {
                    color: $color-secondary;

                    &:hover {
                        background-color: rgba($color-secondary, 0.1);
                    }
                }

                &.arquivado {
                    color: $color-black;

                    &:hover {
                        background-color: rgba($color-black, 0.1);
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

            &.lido {
                color: $color-success;
                background-color: rgba( $color-success, 0.1);
            }

            &.nao-lido {
                background-color: rgba($color-primary, 0.1);
                color: $color-primary;
            }

            &.importante {
                background-color: rgba($color-error, 0.1);
                color: $color-error;
            }

            &.pendente {
                background-color: rgba($color-warning, 0.1);
                color: $color-warning;
            }

            &.arquivado {
                background-color: rgba($color-black, 0.8);
                color: $color-white;
            }
        }
  }
}

</style>
<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_PET_ATENDIMENTO)">Você não possui permissão!</h2>
  <section class="pet-atendimento" v-else>

      <ListaDeDados
          titulo="Pets"
          class="lista-de-pet-atendimento"
      >

          <div class="botao">
            <Butao
              texto="Cadastrar Atendimento"
              @click-botao="toggleNovoAtendimento"
              v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_PET_ATENDIMENTO)"
            />
          </div>

          <Loading v-if="isLoading" />

          <Tabela
              v-else
              :cabecalhos="[
                  {nome: 'Data Atendimento', chave: 'data_atendimento', ordenavel: true}
              ]"
              :linhas="atendimentos.items"
              :orderBy="orderBy"
              :tipoOrderBy="tipoOrderBy"
              @atualizar-orderBy="atualizarOrderBy"
              @click-linha="toggleModal"
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
                      @select-change="buscarAtendimentos"
                      v-model="itensPorPagina"
                      :opcoes="[
                          {texto: '10', value: 10},
                          {texto: '25', value: 25},
                          {texto: '50', value: 50},
                          {texto: '100', value: 100},
                      ]"
                  />
                  <span>Itens Por Página</span>
              </div>
          </div>
      </ListaDeDados>

  </section>

  <ModalPetInformacoesAtendimento
    v-if="modalAbertoDetalhes && atendimento"
    :atendimento="atendimento"
    @fechar-modal="toggleModal"
  />

  <ModalCadastrarPetAtendido
    v-if="modalCadastrar"
    :id_ficha_medica="id_ficha_medica"
    @fechar-modal="toggleNovoAtendimento"
    @buscar="buscarAtendimentos"
  />
</template>

<script setup lang="ts">

const props = defineProps<{
  id_ficha_medica: number
}>()

const pessoaStore = usePessoaStore()
const fichaMedicaStore = useFichaMedicaStore()

const atendimentos = computed(() => fichaMedicaStore.getAtendimentos)

const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('')
const tipoOrderBy = ref('')
const isLoading = ref(true)
const atendimento = ref<null | PetAtendimentoInterface>(null)
const modalAbertoDetalhes = ref(false)
const modalCadastrar = ref(false)

const toggleModal = (a: PetAtendimentoInterface | null) => {
  atendimento.value = a
  modalAbertoDetalhes.value = !modalAbertoDetalhes.value
}

const atualizarPaginadorCompleto = (p: PetMedicamentoPaginacaoInterface) => {
  paginaAtual.value = p.paginaAtual
  itensPorPagina.value = p.itensPorPagina
  ultimaPagina.value = p.totalPaginas
  totalItens.value = p.totalItens
}

const buscarAtendimentos = async () => {
  isLoading.value = true
  const params: Partial<PetBuscarTodosParamsInterface> = {}

  params.itensPorPagina                      = itensPorPagina.value
  params.pagina                              = paginaAtual.value
  if(buscar.value) params.buscar             = buscar.value
  if(orderBy.value) params.ordenacao         = orderBy.value
  if(tipoOrderBy.value) params.tipoOrdenacao = tipoOrderBy.value

  await fichaMedicaStore.fetchBuscarAtendimentos(props.id_ficha_medica, params).then(() => {
      const p = fichaMedicaStore.getAtendimentos
      atualizarPaginadorCompleto(p)
      isLoading.value = false
  }).catch(() => {
      isLoading.value = false
  })
}

const paginacaoTexto = computed(() => {
  const total = totalItens.value || 0
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1
  const fim = Math.min(paginaAtual.value * itensPorPagina.value, total)
  return `Showing ${inicio} to ${fim} of ${total} entries`
})

const atualizarOrderBy = async (value : {orderBy: string, tipoOrderBy: string}) => {
  orderBy.value = value.orderBy
  tipoOrderBy.value = value.tipoOrderBy
  await buscarAtendimentos()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
  if (novaPagina !== paginaAtual.value) {
      paginaAtual.value = novaPagina
      await buscarAtendimentos()
  }
}


const toggleNovoAtendimento = () => {
  modalCadastrar.value = !modalCadastrar.value
}

onMounted(() => {
  buscarAtendimentos()
})


</script>

<style lang="scss">

.pet-atendimento {

  padding: 16px;

  @include md {
    padding: 48px;
  }

  .lista-de-pet-atendimento {

      .botao {
        margin-bottom: 16px;
        width: 100%;

        button {
          height: 50px;
        }

        @include md {
          max-width: 250px;
        }
      }

      .paginacao {
        margin-top: 24px;

        @include md {
            display: grid;
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

            @include md {
                display: block;
                justify-self: end;
            }
        }
      }
  }
}

</style>
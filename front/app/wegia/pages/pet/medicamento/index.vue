<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_MEDICAMENTO)">Você não possui permissão!</h2>
    <section class="fichaPet" v-else>

        <ListaDeDados
            titulo="Medicamentos"
            class="lista-de-ficha-pet"
        >
            <div class="filtros">
                <div class="filtro-busca">
                    <InputText
                        v-model="buscar"
                        placeholder="Search"
                    />
                    <Butao texto="Filtrar" @click-botao="buscarMedicamentos" />
                </div>
            </div>

            <Loading v-if="isLoading" />

            <Tabela
                v-else
                :cabecalhos="[
                    { nome: 'Nome', chave: 'nome_medicamento', ordenavel: true },
                    { nome: 'Acoes', chave: 'acao', ordenavel: false },
                ]"
                :acao="['editar']"
                :linhas="medicamentos.items"
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
                        @select-change="buscarMedicamentos"
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
  permission: Permissao.VISUALIZAR_MEDICAMENTO
})

const router = useRouter()
const menuSectionStore = useMenuSectionStore()
const medicamentoStore = usePetMedicamentoStore()
const pessoaStore = usePessoaStore()

const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('')
const tipoOrderBy = ref('')
const isLoading = ref(true)

menuSectionStore.setTitulo("Medicamentos")
menuSectionStore.setComplemento("Gerencie os medicamentos dos seus pets")

const medicamentos = computed(() => medicamentoStore.getMedicamentos)

const atualizarPaginadorCompleto = (p: PetMedicamentoPaginacaoInterface) => {
  paginaAtual.value = p.paginaAtual
  itensPorPagina.value = p.itensPorPagina
  ultimaPagina.value = p.totalPaginas
  totalItens.value = p.totalItens
}

const buscarMedicamentos = async () => {
  isLoading.value = true
  const params: Partial<PetMedicamentoBuscarTodosParamsInterface> = {}

  params.itensPorPagina                      = itensPorPagina.value
  params.pagina                              = paginaAtual.value
  if(buscar.value) params.buscar             = buscar.value
  if(orderBy.value) params.ordenacao         = orderBy.value
  if(tipoOrderBy.value) params.tipoOrdenacao = tipoOrderBy.value

  await medicamentoStore.fetchMedicamentos(params).then(response => {
    const p = medicamentoStore.getMedicamentos
    atualizarPaginadorCompleto(p)
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
  })
}

const paginacaoTexto = computed(() => {
  const total = totalItens.value || 0
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1
  const fim = Math.min(paginaAtual.value * itensPorPagina.value, total)
  return `Showing ${inicio} to ${fim} of ${total} entries`
})

const atualizarOrderBy = async (value: { orderBy: string, tipoOrderBy: string }) => {
  orderBy.value = value.orderBy
  tipoOrderBy.value = value.tipoOrderBy
  await buscarMedicamentos()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
  if (novaPagina !== paginaAtual.value) {
    paginaAtual.value = novaPagina
    await buscarMedicamentos()
  }
}

const navegarParaMedicamento = (value : {id_medicamento: number}) => {
    router.push(`/pet/medicamento/${value.id_medicamento}`)
}

onMounted(() => {
  buscarMedicamentos()
})
</script>

<style scoped lang="scss">
.fichaPet {
  padding: 48px;

  .lista-de-ficha-pet {
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

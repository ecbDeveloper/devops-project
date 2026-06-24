<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_PET)">Você não possui permissão!</h2>
    <section class="pet" v-else>

        <ListaDeDados
            titulo="Pets"
            class="lista-de-pet"
        >
            <div class="filtros">


                <div class="filtro-busca">
                    <InputText
                        v-model="buscar"
                        placeholder="Search"
                    />
                    <Butao texto="Filtrar" @click-botao="buscarPets" />
                </div>
            </div>

            <Loading v-if="isLoading" />

            <Tabela
                v-else
                :cabecalhos="[
                    {nome: 'Nome', chave: 'nome', ordenavel: true},
                    {nome: 'Cor', chave: 'cor', ordenavel: true},
                    {nome: 'Data Nascimento', chave: 'data_nascimento', ordenavel: true},
                    {nome: 'Data Acolhido', chave: 'data_acolhimento', ordenavel: true},
                    {nome: 'Ação', chave: 'acao', ordenavel: false},
                ]"
                :acao=acoes
                :linhas="pets.items"
                :orderBy="orderBy"
                :tipoOrderBy="tipoOrderBy"
                @atualizar-orderBy="atualizarOrderBy"
                @editar="navegarParaPet"
                @excluir="excluirPet"
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
                        @select-change="buscarPets"
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
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_PET
})

const router = useRouter();
const menuSectionStore = useMenuSectionStore()
const alertStore = useAlertStore()
const petStore = usePetStore()
const situacaoStore = useSituacaoStore()
const pessoaStore = usePessoaStore()

const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('')
const tipoOrderBy = ref('')
const isLoading = ref(true)

const pets = computed(() => petStore.getPets)

menuSectionStore.setTitulo("Pets")
menuSectionStore.setComplemento("Gerencie seus pets cadastrados")

const acoes = computed(() => {
    const a = ['editar']

    if(pessoaStore.possuiPermissao(Permissao.DELETAR_PET)) a.push('deletar')

    return a
})

const atualizarPaginadorCompleto = (p: PetPaginacaoInterface) => {
    paginaAtual.value = p.paginaAtual
    itensPorPagina.value = p.itensPorPagina
    ultimaPagina.value = p.totalPaginas
    totalItens.value = p.totalItens
}

const buscarPets = async () => {
    isLoading.value = true
    const params: Partial<PetBuscarTodosParamsInterface> = {}

    params.itensPorPagina                      = itensPorPagina.value
    params.pagina                              = paginaAtual.value
    if(buscar.value) params.buscar             = buscar.value
    if(orderBy.value) params.ordenacao         = orderBy.value
    if(tipoOrderBy.value) params.tipoOrdenacao = tipoOrderBy.value

    await petStore.fetchPets(params).then(() => {
        const p = petStore.getPets
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
    await buscarPets()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
    if (novaPagina !== paginaAtual.value) {
        paginaAtual.value = novaPagina
        await buscarPets()
    }
}

const excluirPet = async (pet: PetInterface) => {
    try {
        await petStore.fetchDeletarPet(pet.id_pet)
        await buscarPets()
        alertStore.mostrarAlerta('success', 'Pet deletado com sucesso!')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao deletar o pet!')
    }
}

const navegarParaPet = (value : {id_pet: number}) => {
    router.push(`/pet/${value.id_pet}`)
}

onMounted(async () => {
    await buscarPets()
    await situacaoStore.fetchSituacao()
})


</script>

<style scoped lang="scss">

.pet {
    padding: 12px;

    @include lg {
        padding: 48px;
    }

    .lista-de-pet {

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
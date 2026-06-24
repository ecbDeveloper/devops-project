<template>
    <div
        titulo="Funcionarios"
        class="lista-de-atendidos"
    >
            <FiltroFuncionario
                :itensPorPaginaArray="itensPorPaginaArray"
                :itensPorPagina="itensPorPagina"
                :busca="buscar"
                :orderByArray="cabecalho"
                :orderBy="orderBy"
                :tipoOrderBy="tipoOrderBy"
                :situacaoArray="statusOptions"
                :situacao="status"
                @atualizar-filtros="atualizarFiltrosMobile"
                class="filtro-mobile"
            />

            <div class="filtros">

                <InputSelect
                    v-model="status"
                    :opcoes="statusOptions"
                    @select-change="buscarAtendidos"
                />

                <div class="filtro-busca">
                    <InputText
                        v-model="buscar"
                        placeholder="Search"
                    />
                    <Butao texto="Filtrar" @click-botao="buscarAtendidos" />
                </div>
            </div>

            <Loading v-if="isLoading" />

            <Tabela
                v-else
                :cabecalhos="cabecalho"
                :linhas="atendidos"
                :orderBy="orderBy"
                :tipoOrderBy="tipoOrderBy"
                :acao="['editar']"
                @atualizar-orderBy="atualizarOrderBy"
                @editar="editarAtendido"
            />

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
                        @select-change="buscarAtendidos"
                        v-model="itensPorPagina"
                        :opcoes="itensPorPaginaArray"
                    />
                    <span>Itens Por Página</span>
                </div>
            </div>
    </div>
</template>

<script setup lang="ts">

import type { AtendidoPaginacaoInterface } from '~/interface/Atendido/AtendidoPaginacaoInterface';

const router = useRouter()
const atendidoStore = useAtendidoStore()
const menuSectionStore = useMenuSectionStore()

const itensPorPaginaArray = ref([
    {texto: '10', value: 10},
    {texto: '25', value: 25},
    {texto: '50', value: 50},
    {texto: '100', value: 100},
])

const cabecalho = ref([
    {nome: 'Nome', chave: 'nome'},
    {nome: 'cpf', chave: 'cpf'},
    {nome: 'ação', chave: 'acao'},
])

const itensPorPagina = ref(10)
const status = ref(1)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('')
const tipoOrderBy = ref('')
const isLoading = ref(true)

const statusOptions = computed(() => atendidoStore.getAtendidoStatusSelect)

const atendidos = computed(() => {
    const a = atendidoStore.getAtendidos

    if(!a?.items?.length || isLoading.value) return []

    return a.items.map(atendido => {
        return {
            id_atendido: atendido.idatendido,
            cpf: atendido?.pessoa?.cpf,
            nome: atendido?.pessoa?.nome
        }
    })
})

menuSectionStore.setTitulo("Informações")
menuSectionStore.setComplemento("Digite seu CPF")

onMounted(async () => {
    await buscarAtendidos()

    await atendidoStore.fetchBuscarStatus()
})

const atualiazarPaginadorCompleto = (a: AtendidoPaginacaoInterface) => {
    paginaAtual.value = a.paginaAtual
    itensPorPagina.value = a.itensPorPagina
    ultimaPagina.value = a.totalPaginas
    totalItens.value = a.totalItens
}

const buscarAtendidos = async () => {

    isLoading.value = true

    await atendidoStore.fetchBuscarAtendidos(
        {
            id_status: status.value,
            buscar:  buscar.value,
            itensPorPagina: itensPorPagina.value,
            pagina: paginaAtual.value,
            ordenacao: orderBy.value,
            tipoOrdenacao: tipoOrderBy.value,
            with: 'pessoa'
        }
    ).then(response => {
        const a = atendidoStore.getAtendidos
        atualiazarPaginadorCompleto(a)
    })

    isLoading.value = false
}

const paginacaoTexto = computed(() => {
    const total = totalItens.value || 0;
    const inicio = (paginaAtual.value - 1) * itensPorPagina.value + 1;
    const fim = Math.min(paginaAtual.value * itensPorPagina.value, total);
    return `Showing ${inicio} to ${fim} of ${total} entries`;
});

const atualizarOrderBy = async (value : {orderBy: string, tipoOrderBy: string}) => {
    orderBy.value = value.orderBy
    tipoOrderBy.value = value.tipoOrderBy
    await buscarAtendidos()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
    if(novaPagina !== paginaAtual.value) {
        paginaAtual.value = novaPagina;
        await buscarAtendidos()
    }
};

const atualizarFiltrosMobile = async (filtros: any) => {
    status.value = filtros.situacao
    buscar.value = filtros.busca
    itensPorPagina.value = filtros.itensPorPagina
    orderBy.value = filtros.orderBy
    tipoOrderBy.value = filtros.tipoOrderBy

    await buscarAtendidos()
}

const editarAtendido = async (value: {id_atendido: number}) => {
    router.push('atendido/' + value.id_atendido)
}

</script>

<style scoped lang="scss">

.lista-de-atendidos {

        .filtro-mobile {
            display: flex;
            justify-content: flex-end;
            padding: 24px;

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
}


</style>
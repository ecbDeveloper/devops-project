<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUARLIZAR_OCORRENCIA)">Você não possui permissão!</h2>
    <div
        v-else
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
                :situacaoArray="tipoOptions"
                :situacao="tipo"
                @atualizar-filtros="atualizarFiltrosMobile"
                class="filtro-mobile"
            />

            <Butao :texto="textoBotao" class="nova-ocorrencia" @click="atendidoStore.toggleModal" v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_OCORRENCIA)" />

            <div class="filtros">

                <InputSelect
                    v-model="tipo"
                    :opcoes="tipoOptions"
                    @select-change="buscarOcorrencias"
                />

                <div class="filtro-busca">
                    <InputText
                        v-model="buscar"
                        placeholder="Search"
                    />
                    <Butao texto="Filtrar" @click-botao="buscarOcorrencias" />
                </div>
            </div>

            <Loading v-if="isLoading" />

            <Tabela
                v-else
                :cabecalhos="cabecalho"
                :linhas="ocorrencias"
                :orderBy="orderBy"
                :tipoOrderBy="tipoOrderBy"
                @atualizar-orderBy="atualizarOrderBy"
                @click-linha="clickLinha"
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
                        @select-change="buscarOcorrencias"
                        v-model="itensPorPagina"
                        :opcoes="itensPorPaginaArray"
                    />
                    <span>Itens Por Página</span>
                </div>
            </div>
    </div>

    <ModalCadastrarAtendidoOcorrencia
        :id_atendido="atendido.idatendido"
        v-if="modalAberto"
    />

    <ModalPessoaAtendidoOcorrencia
        v-if="ocorrencia"
        :ocorrencia="ocorrencia"
        @fechar-modal="clickLinha"
    />
</template>

<script setup lang="ts">

import type { AtendidoInterface } from '~/interface/Atendido/AtendidoInterface'
import type { AtendidoOcorrenciaPaginacaoInterface } from '~/interface/Atendido/Ocorrencia/AtendidoOcorrenciaPaginacaoInterface'

const props = defineProps({
    atendido: {
        type: Object as () => AtendidoInterface,
        required: true
    }
})

const atendidoStore = useAtendidoStore()
const ocorrenciaStore = useOcorrenciaStore()
const pessoaStore = usePessoaStore()

const itensPorPaginaArray = ref([
    {texto: '10', value: 10},
    {texto: '25', value: 25},
    {texto: '50', value: 50},
    {texto: '100', value: 100},
])


const cabecalho = ref([
    {nome: 'Tipo', chave: 'tipoDescricao', ordenavel: false},
    {nome: 'Data', chave: 'data', ordenavel: true}
])

const itensPorPagina = ref(10)
const tipo = ref(1)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(0)
const buscar = ref('')
const orderBy = ref('data')
const tipoOrderBy = ref('ASC')
const isLoading = ref(true)
const textoBotao = ref('Adicionar Ocorrencia')
const ocorrencia = ref<null | AtendidoOcorrenciaInterface>(null)

const tipoOptions = computed(() => ocorrenciaStore.getOcorrenciaTipoSelect)
const modalAberto = computed(() => atendidoStore.getModalAberto)

const ocorrencias = computed(() => {
    const itens = ocorrenciaStore.getOcorrencias

    if(!itens?.items?.length || isLoading.value) return []

    return itens.items.map(item => {
        return {
            ...item,
            tipoDescricao: item?.tipo?.descricao,
        }
    })
})

const atualiazarPaginadorCompleto = (a : AtendidoOcorrenciaPaginacaoInterface) => {
    paginaAtual.value = a.paginaAtual
    itensPorPagina.value = a.itensPorPagina
    ultimaPagina.value = a.totalPaginas
    totalItens.value = a.totalItens
}

const buscarOcorrencias = async () => {

    isLoading.value = true
    const params: Partial<AtendidoOcorrenciaBuscarTodosParamsInterface> = {
        itensPorPagina: String(itensPorPagina.value),
        pagina: String(paginaAtual.value),
        ordenacao: orderBy.value,
        tipoOrdenacao: tipoOrderBy.value,
        with: 'tipos,atendido.pessoa,funcionario.pessoa,documento'
    }

    if (tipo.value) params.id_tipo = String(tipo.value)

    if (buscar.value) params.buscar = buscar.value


    await ocorrenciaStore.fetchBuscarOcorrencias(props.atendido?.idatendido,params).then(response => {
        const o = ocorrenciaStore.getOcorrencias
        atualiazarPaginadorCompleto(o)
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
    await buscarOcorrencias()
}

const atualizarPaginaAtual = async (novaPagina: number) => {
    if(novaPagina !== paginaAtual.value) {
        paginaAtual.value = novaPagina;
        await buscarOcorrencias()
    }
};

const atualizarFiltrosMobile = async (filtros: any) => {
    tipo.value = filtros.situacao
    buscar.value = filtros.busca
    itensPorPagina.value = filtros.itensPorPagina
    orderBy.value = filtros.orderBy
    tipoOrderBy.value = filtros.tipoOrderBy

    await buscarOcorrencias()
}

const clickLinha = async (o: AtendidoOcorrenciaInterface | null = null ) => {
    ocorrencia.value = o
}

onMounted(async () => {
    await buscarOcorrencias()

    await ocorrenciaStore.fetchBuscarOcorrenciaTipo()
})

</script>

<style scoped lang="scss">

.lista-de-atendidos {

    padding: 24px;

    .nova-ocorrencia {
        height: 48px;
        margin: 16px 0;
        width: 180px;
    }

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
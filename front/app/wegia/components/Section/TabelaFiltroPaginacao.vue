<template>

    <div class="tabela-filtro-paginacao">
        <slot name="tabela-cima"/>
        <div class="topo-tabela">
            <Butao :texto="textoBotao" class="botao-adicionar" @click-botao="clickBotao" v-if="botaoAparecer" />

            <Filtro
                class="filtro-mobile"
                :itensPorPaginaArray="opcoes"
                :itensPorPagina="itensPorPaginaLocal"
                :busca="buscarLocal"
                :orderByArray="cabecalhos"
                :orderBy="orderBy.orderBy"
                :tipoOrderBy="orderBy.tipoOrderBy"
                @atualizar-filtros="atualizarFiltros"
            />

            <div class="filtros">

                <div class="filtro-busca">
                    <InputText
                        v-model="buscarLocal"
                        placeholder="Search"
                    />
                    <Butao texto="Filtrar" @click-botao="cliqueBuscar" />
                </div>
            </div>
        </div>

        <Tabela
            :cabecalhos="cabecalhos"
            :linhas="linhas"
            :orderBy="orderBy.orderBy"
            :tipoOrderBy="orderBy.tipoOrderBy"
            :acao="acao"
            @atualizar-orderBy="atualizarOrderBy"
            @click-linha="clickLinha"
            @excluir="excluir"
            @editar="editar"
            @baixar="baixar"
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
                    @select-change="buscarItensPorPagina"
                    v-model="itensPorPaginaLocal"
                    :opcoes="opcoes"
                />
                <span>Itens Por Página</span>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">

import type { PropType } from 'vue';

interface OrderByInterface {
    orderBy: string
    tipoOrderBy: string
}

interface LinhaInterface {
    [key: string]: any;
};

const props = defineProps({
    cabecalhos: {
        type: Array as PropType<{ nome: string; chave: string, ordenavel: boolean }[]>,
        required: true
    },
    linhas: Array<LinhaInterface> || [],
    textoBotao: String,
    botaoAparecer: {
        type: Boolean,
        default: true
    },
    orderBy: {
        type: Object as PropType<OrderByInterface>,
        default: {orderBy: '', tipoOrderBy: ''}
    },
    buscar: String,
    itensPorPagina: Number,
    paginaAtual: {
        type: Number,
        required: true
    },
    ultimaPagina: {
        type: Number,
        required: true
    },
    totalItens: Number,
    acao: {
        type: Array<String>,
        default: []
    },
    opcoes: {
        type: Array as PropType<{ texto: string; value: number }[]>,
        default: [
            {texto: '10', value: 10},
            {texto: '25', value: 25},
            {texto: '50', value: 50},
            {texto: '100', value: 100},
        ]
    }
})

const buscarLocal = ref(props.buscar)
const itensPorPaginaLocal = ref(props.itensPorPagina);

const emit = defineEmits([
    'click-botao', 'excluir', 'click-linha',
    'baixar', 'editar', 'update:pagina-atual',
    'update:buscar', 'update:order-by', 'update:itens-por-pagina',
    'atualizar-todos-filtros'
])

const paginacaoTexto = computed(() => {
    if(props.paginaAtual && props.totalItens && props.itensPorPagina ) {
        const total = props.totalItens || 0;
        const inicio = (props.paginaAtual - 1) * props.itensPorPagina + 1;
        const fim = Math.min(props.paginaAtual * props.itensPorPagina, total);
        return `Showing ${inicio} to ${fim} of ${total} entries`;
    } else {
        return ''
    }
});

const clickBotao = () => {
    emit('click-botao')
}

const atualizarOrderBy = (value: {orderBy: String, tipoOrderBy: String}) => {
    emit('update:order-by', value)
}

const clickLinha = (linha: any) => {
    emit('click-linha', linha)
}

const cliqueBuscar = () => {
    emit('update:buscar', buscarLocal.value)
}

const excluir = (linha: any) => {
    emit('excluir', linha)
}

const baixar = (linha: any) => {
    emit('baixar', linha)
}

const editar = (linha: any) => {
    emit('editar', linha)
}

const buscarItensPorPagina = () => {
    emit('update:itens-por-pagina', itensPorPaginaLocal.value)
}

const atualizarPaginaAtual = (value: number) => {
    emit('update:pagina-atual', value)
}

const atualizarFiltros = (filtros: any) => {
    emit('atualizar-todos-filtros', filtros)
}

</script>

<style scoped lang="scss">

.tabela-filtro-paginacao {
    padding: 24px;

    .topo-tabela {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .botao-adicionar {
            height: auto;
            min-height: 48px;
            min-width: 60px;
            padding: 0 24px;
            width: auto;
        }

        .filtro-mobile {

            @include md {
                display: none;
            }
        }

        .filtros {
            display: none;
            margin-left: auto;

            @include md {
                display: flex;
                align-self: flex-end
            }

            .filtro-busca {
                justify-content: flex-end;
                align-items: center;
                display: flex;
                gap: 8px;
                width: 100%;

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


</style>
<template>
    <div class="filtro-container">
        <div class="filtro" @click="abrirModal">
            <i class="fas fa-sliders-h"></i>
        </div>

        <Transition name="abrir-modal">
            <div
                v-if="modalAberto"
                class="modal-atras"
                @click.self="fecharModal"
            >
                    <div class="modal-filtro" >
                        <div class="modal-cabecalho">
                            <h3>Filtrar Resultados</h3>
                            <button class="fechar" @click="fecharModal">&times;</button>
                        </div>


                        <div class="modal-body">
                            <slot name="inicio" />

                            <InputText v-model="buscaLocal" placeholder="Search" />

                            <slot name="ordenacao" />

                            <div class="ordenacao">
                                <span>Ordenação</span>
                                <div>
                                    <InputSelect
                                        v-model="orderByLocal"
                                        :opcoes="orderByArrayLocal"
                                    />

                                    <InputSelect
                                        v-model="tipoOrderByLocal"
                                        :opcoes="tipoOrderByArray"
                                    />
                                </div>
                            </div>

                            <slot name="paginacao" />

                            <div >
                                <span>Itens Por Página</span>
                                <InputSelect
                                    v-model="itensPorPaginaLocal"
                                    :opcoes="itensPorPaginaArray"
                                />
                            </div>

                            <slot name="fim" />

                            <button @click="enviar" class="aplicar-filtro">Aplicar Filtros</button>
                        </div>
                    </div>
            </div>
        </Transition>

    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    busca: String,
    itensPorPaginaArray: Array<{ texto: string, value: number }>,
    itensPorPagina: Number,
    orderByArray: Array<{ nome: string, chave: string }>,
    orderBy: String,
    tipoOrderBy: String,
    tipoOrderByArray: {
        type: Array<{ texto: string, value: string }>,
        default: () => [
            { texto: 'Crescente', value: 'ASC' },
            { texto: 'Decrescente', value: 'DESC' }
        ]
    }
})

const emit = defineEmits(['atualizar-filtros'])

const itensPorPaginaLocal = ref(props.itensPorPagina)
const buscaLocal = ref(props.busca)
const tipoOrderByLocal = ref(props.tipoOrderBy)
const orderByLocal = ref(props.orderBy)
const orderByArrayLocal = computed(() => {
    if(!props.orderByArray?.length) return []

    return props.orderByArray.filter(o => o.chave !== 'acao').map((item) => ({
        texto: item.nome,
        value: item.chave
    }))
})

const modalAberto = ref(false)

const abrirModal = () => {
    modalAberto.value = true
}

const fecharModal = () => {
    modalAberto.value = false
}

const enviar = () => {
    modalAberto.value = false
    emit('atualizar-filtros', {
        busca: buscaLocal.value,
        itensPorPagina: itensPorPaginaLocal.value,
        orderBy: orderByLocal.value,
        tipoOrderBy: tipoOrderByLocal.value
    })
}

watch(() => props.itensPorPagina, (value) => {
    if (value !== itensPorPaginaLocal.value) {
      itensPorPaginaLocal.value = value
    }
  }
)

watch(() => props.busca, (value) => {
    if (value !== buscaLocal.value) {
        buscaLocal.value = value
    }
  }
)

watch(() => props.orderBy, (value) => {
    if (value !== orderByLocal.value) {
        orderByLocal.value = value
    }
  }
)

watch(() => props.tipoOrderBy, (value) => {
    if (value !== tipoOrderByLocal.value) {
        tipoOrderByLocal.value = value
    }
  }
)

</script>

<style scoped lang="scss">

.abrir-modal-enter-active,
.abrir-modal-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.abrir-modal-enter-from,
.abrir-modal-leave-to
{
    opacity: 0;
}

.abrir-modal-enter-to,
.abrir-modal-leave-from {
    opacity: 1;
}


.filtro-container {
    .filtro {
        align-items: center;
        background-color: $color-white;
        border: 1px solid $color-black;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        font-size: 24px;
        height: 60px;
        justify-content: center;
        transition: background-color 0.3s;
        width: 60px;

        &:hover {
            background-color: $color-tertiary;
        }
    }

    .modal-atras {
        background-color: rgba($color-black, 0.4);
        bottom: 0;
        display: flex;
        justify-content: flex-end;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1000;

        .modal-filtro {
            background-color: $color-white;
            box-shadow: -4px 0 10px rgba($color-black, 0.2);
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 24px;
            position: fixed;
            width: 100%;
            z-index: 1000;

            @include sm {
                max-width: 400px;
            }

            @include md {
                max-width: 480px;
            }

            .modal-cabecalho {
                align-items: center;
                display: flex;
                justify-content: space-between;


                .fechar {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 24px;
                }
            }

            .modal-body {
                display: flex;
                flex-direction: column;

                .ordenacao {
                    &>div {
                        display: flex;
                        gap: 32px;

                        .input-select {
                            width: 100%;
                        }
                    }
                }

                .aplicar-filtro {
                    background-color: $color-primary;
                    border: none;
                    border-radius: 8px;
                    color: $color-white;
                    cursor: pointer;
                    padding: 10px;

                    &:hover {
                        background-color: $color-primary-opacity;
                    }
                }
            }
        }
    }
}

</style>

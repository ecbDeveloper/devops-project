<template>
    <Filtro
        :itensPorPaginaArray="itensPorPaginaArray"
        :itensPorPagina="itensPorPagina"
        :busca="busca"
        :orderByArray="orderByArray"
        :orderBy="orderBy"
        :tipoOrderBy="tipoOrderBy"
        @atualizar-filtros="atualizarFiltros"
    >
        <template #ordenacao>
            <InputSelect
                v-model="situacaoLocal"
                :opcoes="situacaoArray"
            />
        </template>

    </Filtro>
</template>

<script setup lang="ts">

const props = defineProps({
    busca: String,
    itensPorPaginaArray: Array<{ texto: string, value: number }>,
    itensPorPagina: Number,
    orderByArray: Array<{ nome: string, chave: string }>,
    orderBy: String,
    tipoOrderBy: String,
    situacaoArray: Array<{ texto: string, value: number | string }>,
    situacao: Number
})

const emit = defineEmits(['atualizar-filtros'])

const situacaoLocal = ref(props.situacao)

const atualizarFiltros = (filtros: any) => {
    emit('atualizar-filtros', {
        ...filtros,
        situacao: situacaoLocal.value
    })
}

</script>
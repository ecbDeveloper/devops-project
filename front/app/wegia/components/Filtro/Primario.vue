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
              v-model="selectLocal"
              :opcoes="selectArray"
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
  selectArray: Array<{ texto: string, value: number | string }>,
  select: String
})

const emit = defineEmits(['atualizar-filtros'])

const selectLocal = ref(props.select)

const atualizarFiltros = (filtros: any) => {
  emit('atualizar-filtros', {
      ...filtros,
      select: selectLocal.value
  })
}

</script>
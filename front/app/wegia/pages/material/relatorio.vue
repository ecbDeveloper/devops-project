<template>

  <div class="container container-relatorio">
      <div class="tipo-relatorio">
        <InputSelect
          label="Tipo de Relatório"
          v-model="tipoRelatorio"
          :opcoes="[
            { value: 1, texto: 'Relatório de Entrada'},
            { value: 2, texto: 'Relatório de Saída'},
            { value: 3, texto: 'Relatório de Estoque'},
            { value: 4, texto: 'Relatório de Produtos'},
          ]"
        />
      </div>

      <forms-material-relatorio-transacao
        v-if="tipoRelatorio === 1"
        tipo="e"
      />

      <forms-material-relatorio-transacao
        v-if="tipoRelatorio === 2"
        tipo="s"
      />

      <forms-material-relatorio-estoque
        v-if="tipoRelatorio === 3"
      />

      <forms-material-relatorio-produto
        v-if="tipoRelatorio === 4"
      />
  </div>

</template>

<script setup lang="ts">

const tipoRelatorio = ref<string | number>("")

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_RELATORIO
})


</script>

<style scoped lang="scss">

.container-relatorio {
  margin-top: 24px;

  .tipo-relatorio {
    margin-bottom: 112px;
  }
}

</style>
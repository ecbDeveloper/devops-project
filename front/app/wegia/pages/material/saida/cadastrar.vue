<template>

  <div class="cadastrar-transacao">
    <forms-material-transacao
      :tipoMovimentacao="TipoMovimentacaoEnum.SAIDA"
    />
  </div>

</template>

<script setup lang="ts">

import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_MATERIAL_SAIDA
})

</script>

<style scoped>

.cadastrar-transacao {
  padding: 8px;
}

</style>
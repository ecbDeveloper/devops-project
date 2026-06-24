<template>
  <tabela-material-transacao
    :tipo=TipoMovimentacaoEnum.ENTRADA
  />
</template>

<script setup lang="ts">

import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_ENTRADA
})

</script>

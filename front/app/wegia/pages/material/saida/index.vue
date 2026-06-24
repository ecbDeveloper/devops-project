<template>
  <tabela-material-transacao
    :tipo=TipoMovimentacaoEnum.SAIDA
  />
</template>

<script setup lang="ts">

import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_SAIDA
})

</script>

<template>

  <modal @fechar-modal="emit('fechar-modal')" class="modal-relatorio-transacao">
      <h3>Relatório de estoque</h3>
      <p><strong>Almoxarifado:</strong> {{ almoxarifado ? almoxarifado : 'Todos' }}</p>

      <tabela
        class="tabela"
        :cabecalhos="[
          { nome: 'Quantidade', chave: 'quantidade_estoque', ordenavel: false },
          { nome: 'Descrição', chave: 'produto', ordenavel: false },
          { nome: 'Preço Médio', chave: 'preco_medio', ordenavel: false },
          { nome: 'Tipo de Unidade', chave: 'unidade', ordenavel: false },
          { nome: 'Total', chave: 'total', ordenavel: false }
        ]"
        :linhas="relatorio"
      />
  </modal>
</template>

<script setup lang="ts">

defineProps<{
  almoxarifado?: string | null
}>()

const emit = defineEmits(['fechar-modal'])

const materialRelatorioStore = useMaterialRelatorioStore()

const relatorio = computed(() => {
  const r = materialRelatorioStore.getEstoque

  if(!r.length) return []

  return r.map(re => {
    return {
      ...re,
      preco_medio: `R$ ${re.preco_medio.toFixed(2).replace('.', ',')}`,
      total: `R$ ${re.total.toFixed(2).replace('.', ',')}`
    }
  })
})

</script>

<style lang="scss">

.modal-relatorio-transacao {
  &>.modal {
    height: calc(100% - 48px);
    width: calc(100% - 48px);

    h3 {
      margin-bottom: 12px;
    }

    p {
      margin-bottom: 0px;
    }

    .tabela {
      margin-top: 24px;
    }
  }

}

</style>
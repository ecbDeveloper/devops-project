<template>

  <modal @fechar-modal="emit('fechar-modal')" class="modal-relatorio-transacao">
      <h3>Relatório de {{ tipo === 'e' ? 'Entrada' : 'Saida' }}</h3>
      <p><strong>{{ tipo === 'e' ? 'Origem' : 'Destino' }}:</strong>  {{ origemSaida ? origemSaida : 'Todos' }}</p>
      <p><strong>Tipo:</strong>  {{ tipoMovimentacao ? tipoMovimentacao : 'Todos' }}</p>
      <p><strong>Responsável:</strong>  {{ responsavel ? responsavel : 'Todos' }}</p>
      <p><strong>A partir de:</strong>  {{ periodoInicial ? periodoInicial : 'Não informado' }}</p>
      <p><strong>Até:</strong> {{  periodoFinal ? periodoFinal : 'Não informado' }}</p>
      <p><strong>Almoxarifado:</strong>  {{ almoxarifado ? almoxarifado : 'Todos' }}</p>
      <p><strong>Valor Total:</strong>  R$ {{ valorTotal.toFixed(2).replace('.', ',') }}</p>

      <tabela
        class="tabela"
        :cabecalhos="[
          { nome: 'Quantidade', chave: 'quantidade_total', ordenavel: false },
          { nome: 'Descrição', chave: 'produto', ordenavel: false },
          { nome: 'Data de Registro', chave: 'data', ordenavel: false },
          { nome: 'Valor Unitário', chave: 'valor_unitario_string', ordenavel: false },
          { nome: 'Tipo de Unidade', chave: 'unidade', ordenavel: false },
          { nome: 'Total', chave: 'valor_total_string', ordenavel: false }
        ]"
        :linhas="relatorio"
      />
  </modal>
</template>

<script setup lang="ts">

defineProps<{
  tipo: 'e' | `s`
  periodoInicial?: String | null
  periodoFinal?: String | null
  almoxarifado?: String | null
  responsavel?: String | null
  origemSaida?: String | null
  tipoMovimentacao?: String | null
}>()

const emit = defineEmits(['fechar-modal'])

const materialRelatorioStore = useMaterialRelatorioStore()

const valorTotal = computed(() => {
  return relatorio.value.reduce((soma, item) => {
    const valor = Number(item.valor_total) || 0
    return soma + (Number.isNaN(valor) ? 0 : valor)
  }, 0)
})
const relatorio = computed(() => {
  const r = materialRelatorioStore.getRelatorio

  if(!r.length) return []

  return r.map(re => {
    return {
      ...re,
      valor_total_string: `R$ ${re.valor_total.toFixed(2).replace('.', ',')}`,
      valor_unitario_string: `R$ ${re.valor_unitario.toFixed(2).replace('.', ',')}`,
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
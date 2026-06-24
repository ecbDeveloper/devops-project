<template>

  <modal @fechar-modal="emit('fechar-modal')" class="modal-relatorio-produto">
      <h3>Relatório de estoque</h3>
      <p><strong>Produto:</strong> {{ produto ? produto[0].produto : 'Não registrado' }}</p>
      <p><strong>Almoxarifado:</strong> {{ almoxarifado ? almoxarifado : 'Todos' }}</p>
      <p><strong>Unidade:</strong> {{ produto ? produto[0].unidade : 'Não registrado' }}</p>
      <p><strong>Estoque Atual:</strong> {{ produto.length ? estoque : 'Não registrado' }}</p>
      <p><strong>A partir de:</strong>  {{ periodoInicial ? periodoInicial : 'Não informado' }}</p>
      <p><strong>Até:</strong> {{  periodoFinal ? periodoFinal : 'Não informado' }}</p>


      <h2 class="titulo-relatorio">ENTRADAS</h2>

      <tabela
        class="tabela"
        :cabecalhos="[
          { nome: 'Data', chave: 'data', ordenavel: false },
          { nome: 'Tipo', chave: 'tipo_movimentacao', ordenavel: false },
          { nome: 'Quantidade', chave: 'quantidade', ordenavel: false }
        ]"
        :linhas="relatorioEntrada"
      />

      <h2 class="titulo-relatorio">SAIDAS</h2>

      <tabela
        class="tabela"
        :cabecalhos="[
          { nome: 'Data', chave: 'data', ordenavel: false },
          { nome: 'Tipo', chave: 'tipo_movimentacao', ordenavel: false },
          { nome: 'Quantidade', chave: 'quantidade', ordenavel: false }
        ]"
        :linhas="relatorioSaida"
      />
  </modal>
</template>

<script setup lang="ts">

defineProps<{
  almoxarifado?: string | null
  periodoInicial?: string | null
  periodoFinal?: string | null
}>()

const emit = defineEmits(['fechar-modal'])

const materialRelatorioStore = useMaterialRelatorioStore()
const produto = computed(() => materialRelatorioStore.getProduto ?? [])

const relatorioEntrada = computed(() => {
  const r = materialRelatorioStore.getProduto

  if(!r.length) return []

  return r.filter(re => re.tipo === TipoMovimentacaoEnum.ENTRADA)
})

const relatorioSaida = computed(() => {
  const r = materialRelatorioStore.getProduto

  if(!r.length) return []

  return r.filter(re => re.tipo === TipoMovimentacaoEnum.SAIDA)
})

const estoque = computed(() => {
  let estoquePorProduto = 0
  produto.value.forEach(item => {

    if (item.tipo === 'e') {
      estoquePorProduto += item.quantidade;
    } else if (item.tipo === 's') {
      estoquePorProduto -= item.quantidade;
    }
  });

  return estoquePorProduto
})

</script>

<style lang="scss">

.modal-relatorio-produto {
  &>.modal {
    height: calc(100% - 48px);
    width: calc(100% - 48px);

    h3 {
      margin-bottom: 12px;
    }

    p {
      margin-bottom: 0px;
    }

    .titulo-relatorio {
      margin-top: 24px;
    }
  }

}

</style>
<template>

  <div class="forms-material-relatorio-estoque">
    <InputSelect
      label="Almoxarifado"
      v-model="almoxarifado"
      :opcoes="almoxarifadoOpcoes"
    />

    <div class="div-botao">
      <butao texto="gerar" @click-botao="gerarRelatorio" />
    </div>

    <modal-material-relatorio-estoque
      v-if="modalAberto"
      :almoxarifado="almoxarifadoSelecionado?.texto"
      @fechar-modal="toggleModal"
    />
  </div>
</template>

<script setup lang="ts">

const materialAlmoxarifadoStore     = useMaterialAlmoxarifadoStore()
const materialRelatorioStore        = useMaterialRelatorioStore()

const almoxarifadoOpcoes = computed(() => materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect)
const almoxarifadoSelecionado = computed(() => {
  return almoxarifadoOpcoes.value.find(
    a => a.value === Number(almoxarifado.value)
  )
})

const modalAberto      = ref(false)
const almoxarifado     = ref('')

const toggleModal = () => { modalAberto.value = !modalAberto.value }

const gerarRelatorio = async () => {
  try {
    const params: Partial<MaterialRelatorioBuscarTodosParamsInterface> = {}

    if (almoxarifado.value)     params.id_almoxarifado   = almoxarifado.value

    await materialRelatorioStore.fetchRelatorioEstoque(params)

    toggleModal()
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  if(!materialAlmoxarifadoStore.getAlmoxarifadoParaFiltrosParaSelect.length) await materialAlmoxarifadoStore.fetchAlmoxarifadoParaFiltros()
})

</script>

<style scoped lang="scss">

.forms-material-relatorio-estoque {

  .div-botao {
    justify-content: flex-end;
    display: flex;

    button {
      height: 32px;
      width: 96px;
    }
  }
}

</style>
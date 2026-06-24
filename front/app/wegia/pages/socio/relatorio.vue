<template>

  <div class="forms-socio-relatorio">

    <h2>Parâmetros do relatório</h2>

    <Forms
      textoBotao="Gerar relatório"
      :formulario="formulario"
      @enviarFormulario="gerarRelatorio"
    />
  </div>

  <modal-socio-relatorio
    v-if="modalAberto"
    :params="params"
    @fechar-modal="toggleModal"
  />

</template>

<script setup lang="ts">

import { gerarRelatorioSocio } from '~/forms/Socio/RelatorioSocio';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_SOCIO_RELATORIO
})

const socioTagStore    = useSocioTagStore()
const socioStatusStore = useSocioStatusStore()
const socioStore       = useSocioStore()

const formulario   = ref(gerarRelatorioSocio)
const modalAberto  = ref(false)
const params       = ref<Partial<SocioRelatorioInterface>>({})

const toggleModal = () => { modalAberto.value = !modalAberto.value }

const gerarRelatorio = async () => {
  try {
    params.value = formatFormToJson([formulario.value])

    await socioStore.fetchSociosRelatorio(params.value)

    toggleModal()
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  if(!socioTagStore.getTagsFiltros.length) await socioTagStore.fetchTagsFiltro()
  if(!socioStatusStore.getStatusParaFiltro.length) await socioStatusStore.fetchSocioStatus()
})

</script>

<style scoped lang="scss">

.forms-socio-relatorio {

  padding: 24px;

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
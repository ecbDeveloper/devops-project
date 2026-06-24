<template>
  <div>
    <Alert v-if="visivel" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet">
</template>

<script setup>

const alertStore                        = useAlertStore()
const configuracaoCampoImagemStore      = useConfiguracaoCampoImagemStore()
const configuracaoSelecaoParagrafoStore = useConfiguracaoSelecaoParagrafoStore()

const visivel = computed(() => alertStore.getVisivel)

onMounted(async () => {
  if(!configuracaoCampoImagemStore.getCampoImagemLogo) await configuracaoCampoImagemStore.fetchCampoImagem()
  if(!configuracaoSelecaoParagrafoStore.getParagrafos.length) await configuracaoSelecaoParagrafoStore.fetchParagrafos()

  useHead({
    link: [
      {
        rel: 'icon',
        href: configuracaoCampoImagemStore.getCampoImagemLogoUrl
      }
    ]
  })
})

</script>

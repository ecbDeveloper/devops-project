<template>


  <section class="section-configuracao-editar-conteudo-imagens">
    <p>Clique na imagem para editar.</p>

    <div class="container-logo">
      <h2>Logo</h2>

      <img :src="logoSrc" alt="Logo do sistema" @click="modalLogo = true" />

    </div>

    <modal-configuracao-editar-conteudo-imagem-logo
      v-if="modalLogo"
      @fechar-modal="modalLogo = false"
    />
  </section>

</template>

<script setup lang="ts">

const configuracaoCampoImagemStore = useConfiguracaoCampoImagemStore()

const modalLogo = ref(false)

const logo = computed(() => configuracaoCampoImagemStore.getCampoImagemLogo)

const logoPadrao = new URL('@/assets/img/logo_wegia.png', import.meta.url).href

const logoSrc = computed(() => {
  return logo.value?.imagens?.[0]?.imagem || logoPadrao
})

</script>

<style scoped lang="scss">

.section-configuracao-editar-conteudo-imagens {

  padding: 36px 72px;

  .container-logo {
    align-items: center;
    display: flex;
    justify-content: space-between;

    img {
      cursor: pointer;
      width: 360px;
    }
  }
}

</style>
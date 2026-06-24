<template>"
  <Modal @fechar-modal="emit('fechar-modal')" class="modal-imagem-logo">

    <input-file
      class="input-file"
      v-model="novaLogo"
      placeholder="Alterar imagem"
      accept="image/png, image/jpeg, image/jpg"
    />

    <div class="container-logo">
      <h2>Logo</h2>

      <img :src="logoSrc" alt="Logo do sistema"/>

    </div>

    <div class="acoes">
      <butao texto="Salvar" @click-botao="salvar" />
    </div>

  </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits(['fechar-modal'])


const configuracaoCampoImagemStore = useConfiguracaoCampoImagemStore()
const configuracaoImagemStore      = useConfiguracaoImagemStore()
const alertStore                   = useAlertStore()

const novaLogo = ref(null)

const logo = computed(() => configuracaoCampoImagemStore.getCampoImagemLogo)

const logoSrc = computed(() => configuracaoCampoImagemStore.getCampoImagemLogoUrl)

const salvar = async () => {

  if(!novaLogo.value) return alertStore.mostrarAlerta('error', 'Escolha uma imagem!')
  if(!logo.value) return

  try {
    const formData = new FormData()
    const logoImagem = logo.value?.imagens?.[0]
    formData.append('imagem', novaLogo.value)

    if(logoImagem?.imagem) {
      await configuracaoImagemStore.fetchSincronizarImagemNoCampo(logoImagem.id_imagem, logo.value.id_campo, formData)
    } else {
      await configuracaoImagemStore.fetchCadastrarImagemNoCampo(logo.value.id_campo, formData)
    }

    alertStore.mostrarAlerta('success', 'Imagem alterado com sucesso!')
    configuracaoCampoImagemStore.fetchCampoImagem()
    emit('fechar-modal')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao enviar a imagem!')
  }

}

</script>

<style scoped lang="scss">
.modal-imagem-logo  {

  .modal{
    width: 480px;

    .input-file {
      margin-top: 32px;
    }


    .container-logo {
      align-items: center;
      display: flex;
      justify-content: space-between;

      img {
        width: 360px;
      }
    }

    .acoes {
      display: flex;
      justify-content: flex-end;
      margin-top: 48px;

      button {
        width: 240px;
      }
    }
  }



}
</style>

<template>
  <div class="card-pix">
    <div class="card-pix__header">
      <h3 class="card-pix__title">Pagamento via PIX</h3>
    </div>

    <div class="card-pix__content">
      <div class="card-pix__qrcode">
        <img :src="qrCodeImage" alt="QR Code PIX" class="card-pix__qrcode-img" />
      </div>

      <div class="card-pix__instructions">
        <p class="card-pix__text">Escaneie o QR Code ou copie o código abaixo:</p>
      </div>

      <div class="card-pix__copy-section">
        <input
          type="text"
          :value="pixCode"
          readonly
          class="card-pix__input"
          ref="pixInput"
        />
        <button
          @click="copiarCodigo"
          class="card-pix__button"
          :class="{ 'card-pix__button--copied': copiado }"
        >
          {{ copiado ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>

      <div v-if="copiado" class="card-pix__success">
        ✓ Código copiado com sucesso!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  qrCodeImage: {
    type: String,
    required: true
  },
  pixCode: {
    type: String,
    required: true
  }
})

const copiado = ref(false)
const pixInput = ref(null)

const copiarCodigo = () => {
  navigator.clipboard.writeText(props.pixCode).then(() => {
    copiado.value = true
    setTimeout(() => {
      copiado.value = false
    }, 3000)
  }).catch(err => {
    console.error('Erro ao copiar:', err)
  })
}
</script>

<style lang="scss" scoped>
.card-pix {
  background: $color-white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
  overflow: hidden;

  &__header {
    background: $color-primary;
    padding: 16px 20px;
  }

  &__title {
    color: $color-white;
    font-family: $font-secondary;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    text-align: center;
  }

  &__content {
    padding: 24px 20px;
  }

  &__qrcode {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  &__qrcode-img {
    width: 200px;
    height: 200px;
    border: 2px solid $color-secondary;
    border-radius: 8px;
    padding: 8px;
    background: $color-white;
  }

  &__instructions {
    margin-bottom: 16px;
  }

  &__text {
    color: $color-quaternary;
    font-family: $font-primary;
    font-size: 14px;
    text-align: center;
    margin: 0;
  }

  &__copy-section {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  &__input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid $color-secondary;
    border-radius: 4px;
    font-family: $font-tertiary;
    font-size: 13px;
    color: $color-quaternary;
    background: $color-tertiary;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $color-primary;
    }
  }

  &__button {
    padding: 10px 20px;
    background: $color-primary;
    color: $color-white;
    border: none;
    border-radius: 4px;
    font-family: $font-secondary;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
      background: rgb(0, 110, 165);
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }

    &--copied {
      background: $color-success;

      &:hover {
        background: rgb(0, 100, 0);
        opacity: 0.9;
      }
    }
  }

  &__success {
    text-align: center;
    color: $color-success;
    font-family: $font-primary;
    font-size: 13px;
    font-weight: 600;
    padding: 8px;
    background: rgba(0, 128, 0, 0.1);
    border-radius: 4px;
  }
}

@media (max-width: 480px) {
  .card-pix {
    max-width: 100%;

    &__qrcode-img {
      width: 180px;
      height: 180px;
    }

    &__copy-section {
      flex-direction: column;
    }

    &__button {
      width: 100%;
    }
  }
}
</style>
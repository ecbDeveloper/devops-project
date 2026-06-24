<template>
  <Modal @fechar-modal="emit('fechar-modal')">
    <div class="modal-saude-intercorrencia-detalhe">
      <h3 class="titulo">Detalhes da Intercorrência</h3>

      <div class="info-basica">
        <p><strong>Data da intercorrencia:</strong> {{ intercorrencia.data }}</p>
        <p><strong>Funcionário:</strong> {{ intercorrencia.funcionario?.pessoa?.nome ?? '---' }}</p>
      </div>

      <div class="descricao" v-if="intercorrencia.descricao">
        <h4>Descrição</h4>
        <p>{{ intercorrencia.descricao }}</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">

defineProps<{
  intercorrencia: SaudeIntercorrenciaInterface
}>()

const emit = defineEmits(['fechar-modal'])
</script>

<style scoped lang="scss">
.modal-saude-intercorrencia-detalhe {
  height: auto;
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;

  .titulo {
    font-family: $font-secondary;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: $color-primary;
  }

  .info-basica {
    margin-bottom: 1.5rem;

    p {
      font-family: $font-primary;
      font-size: 0.95rem;
      margin: 0.3rem 0;
      strong {
        color: $color-primary;
      }
    }
  }

  .descricao {
    margin-bottom: 1.5rem;

    h4 {
      font-family: $font-secondary;
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: $color-quaternary;
    }

    p {
      font-family: $font-primary;
      font-size: 0.95rem;
      color: $color-septenary;
    }
  }

  .medicacoes {
    h4 {
      font-family: $font-secondary;
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: $color-quaternary;
    }

    ul {
      list-style: disc;
      padding-left: 1.2rem;

      li {
        font-family: $font-primary;
        font-size: 0.95rem;
        margin: 0.3rem 0;

        .nome {
          font-weight: 600;
          color: $color-primary;
        }
        .dosagem {
          color: $color-black;
        }
      }
    }
  }
}
</style>

<template>
  <Modal @fechar-modal="emit('fechar-modal')">
    <div class="modal-saude-atendimento-detalhe">
      <h3 class="titulo">Detalhes do Atendimento</h3>

      <div class="info-basica">
        <p><strong>Data do Atendimento:</strong> {{ atendimento.data_atendimento }}</p>
        <p><strong>Data de Registro:</strong> {{ atendimento.data_registro }}</p>
        <p><strong>Médico:</strong> {{ atendimento.medico?.nome }} (CRM: {{ atendimento.medico?.crm }})</p>
        <p><strong>Funcionário:</strong> {{ atendimento.funcionario?.pessoa?.nome ?? '---' }}</p>
      </div>

      <div class="descricao" v-if="atendimento.descricao">
        <h4>Descrição</h4>
        <p>{{ atendimento.descricao }}</p>
      </div>

      <div class="medicacoes" v-if="atendimento.medicacoes?.length">
        <h4>Medicações</h4>
        <ul>
          <li v-for="med in atendimento.medicacoes" :key="med.id_medicacao">
            <span class="nome">{{ med.medicamento }}</span> -
            <span class="dosagem">{{ med.dosagem }}</span>
            ({{ med.horario }}) —

            <strong class="status" :class="med.status.toLowerCase()">
              {{ med.status }}
            </strong>

          </li>
        </ul>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  atendimento: SaudeAtendimentoInterface
}>()

const emit = defineEmits(['fechar-modal'])
</script>

<style scoped lang="scss">
.modal-saude-atendimento-detalhe {
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

        .status {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;

          &.tratamento {
            color: $color-intercurrences;
          }

          &.concluido {
            color: $color-success;
          }

          &.substituido {
            color: $color-warning;
          }

          &.cancelado {
            color: $color-error;
          }
        }

      }
    }
  }
}
</style>

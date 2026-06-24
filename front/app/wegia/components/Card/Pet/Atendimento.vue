<template>
  <div class="card-atendimento">
    <div class="cabecalho">
      <p><strong>Data do Atendimento:</strong> {{ atendimento.data_atendimento }}</p>
      <p><strong>Ficha Médica:</strong></p>
    </div>

    <div class="corpo">
      <p><strong>Descrição:</strong> {{ atendimento.descricao }}</p>

      <div v-if="atendimento.medicacao.length" class="medicacoes">
        <p><strong>Medicações:</strong></p>
        <ul>
          <li v-for="med in atendimento?.medicacao" :key="med.id_medicacao">
            <p><strong>Nome:</strong> {{ med?.medicamento?.nome_medicamento }}</p>
            <p><strong>Descrição:</strong> {{ med?.medicamento?.descricao_medicamento }}</p>
            <p><strong>Aplicação:</strong> {{ med?.medicamento?.aplicacao }}</p>
            <small><strong>Data da Medicação:</strong> {{ med?.data_medicacao }}</small>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  atendimento: PetAtendimentoInterface
}>()
</script>

<style scoped lang="scss">
.card-atendimento {
    padding: 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;

    p {
      font-size: 14px;

      @include md {
        font-size: 20px;
      }
    }

    .cabecalho {
      color: #333;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .corpo {
      color: #444;
      margin: 0 0 8px 0;

      .medicacoes {
        margin-top: 10px;

        ul {
          list-style: none;
          padding: 0;

          li {
            margin-bottom: 12px;
            padding: 8px;
            border-left: 4px solid #ccc;
            background-color: #f9f9f9;
            border-radius: 4px;

            p, small {
              margin: 2px 0;
            }
          }
        }
      }
    }

    .rodape {
      font-size: 0.9rem;
      color: #777;
      text-align: right;
    }
}
</style>

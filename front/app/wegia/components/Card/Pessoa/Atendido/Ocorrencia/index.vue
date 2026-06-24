<template>
  <div class="card-ocorrencia">
    <div class="cabecalho">
      <h3>Ocorrência - {{ ocorrencia.data }}</h3>
      <span class="tipo">{{ ocorrencia?.tipo?.descricao }}</span>

      <div class="pessoas">
        <p><strong>Atendido:</strong> {{ ocorrencia?.atendido?.pessoa?.nome || 'Não informado' }}</p>
        <p><strong>Funcionário:</strong> {{ ocorrencia?.funcionario?.pessoa?.nome || 'Não informado' }}</p>
      </div>

    </div>

    <div class="corpo">
      <strong>Descrição:</strong>
      <p class="descricao">{{ ocorrencia.descricao || 'Sem descrição' }}</p>

      <div class="documento" v-if="ocorrencia.documento">
        <button class="visualizar" @click="baixar">Visualizar Documento</button>
      </div>
      <div class="documento vazio" v-else>
        <p>Sem documento anexado</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  ocorrencia: AtendidoOcorrenciaInterface
}>()

const baixar = () => {
  if (props.ocorrencia.documento) {
    baixarImagem(
      props.ocorrencia.documento.arquivo,
      props.ocorrencia.documento.arquivo_extensao,
      props.ocorrencia.documento.arquivo_nome
    )
  }
}
</script>

<style scoped lang="scss">
.card-ocorrencia {
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-family: $font-tertiary;

  .cabecalho {
    margin-bottom: 12px;
    padding-bottom: 8px;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: $color-primary;
    }

    .tipo {
      background-color: $color-primary;
      border-radius: 16px;
      color: $color-white;
      font-size: 12px;
      padding: 4px 12px;
    }

    .pessoas {
      margin-top: 16px;
    }

    p {
      margin: 2px 0;
      color: $color-quaternary;
      font-size: 0.95rem;
    }
  }

  .corpo {
    color: $color-septenary;
    margin-bottom: 16px;

    .descricao {
      margin-bottom: 12px;
      font-size: 1rem;
      line-height: 1.4;
    }

    .documento {
      margin-top: 10px;

      &.vazio {
        color: $color-senary;
        font-style: italic;
      }

      .visualizar {
        background-color: $color-primary;
        color: $color-white;
        padding: 8px 14px;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: $color-primary-opacity;
        }
      }
    }
  }
}
</style>

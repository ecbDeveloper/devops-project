<template>
  <Modal @fechar-modal="emit('fechar-modal')">
    <div class="modal-historico-prontuario">
      <h3 class="titulo">Histórico do Prontuário</h3>

      <InputSelect
        v-model="selectedId"
        :opcoes="opcoesHistorico"
        label="versão: "
        @select-change="onSelectChange"
      />

      <div class="historico-conteudo" v-if="versaoSelecionada">
        <p>{{ versaoSelecionada.prontuario }}</p>
      </div>

    </div>
  </Modal>
</template>

<script setup lang="ts">

const props = defineProps<{
  historico: SaudeProntuarioHistoricoInterface[]
}>()

const emit = defineEmits(['fechar-modal'])

const selectedId = ref<string | number>('')

const opcoesHistorico = computed(() => {
  return props.historico.map(h => ({
    value: h.id_prontuario_historico,
    texto: `${h.data}`
  }))
})

const versaoSelecionada = computed(() =>
  props.historico.find(h => h.id_prontuario_historico == selectedId.value)
)

const onSelectChange = (val: string | number) => {
  selectedId.value = val
}
</script>

<style scoped lang="scss">

.modal-historico-prontuario {

  height: 400px;

  .titulo {
    font-family: $font-secondary;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: $color-primary;
  }

  .historico-conteudo {
    background-color: $color-tertiary;
    border-radius: 8px;
    margin-top: 1rem;
    height: 270px;
    padding: 1rem;
    overflow-y: auto;
    overflow-x: hidden;

    p {
      color: $color-quaternary;
      height: 250px;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}
</style>

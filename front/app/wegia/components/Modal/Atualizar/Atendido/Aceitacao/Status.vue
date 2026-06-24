<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>Atualizar Status</p>

      <input-select
        v-model="status"
        titulo="Status"
        :opcoes="statusOptions"
      />

      <div class="botoes-modal">

        <butao
          texto="Atualizar"
          class="botao-atualizar"
          @click-botao="emit('atualizar', status)"
        />
      </div>

  </Modal>

</template>

<script setup lang="ts">


const props = defineProps<{
  id_status: number;
}>();

const emit = defineEmits(['fechar-modal', 'atualizar'])

const atendidoAceitacaoStore      = useAtendidoAceitacaoStore()
const statusOptions = computed(() => atendidoAceitacaoStore?.getStatusParaSelect ?? [])

const status = ref<string | number>(props.id_status ?? '')

onMounted(async () => {
  if(!atendidoAceitacaoStore.getStatusParaSelect.length) await atendidoAceitacaoStore.fetchAtendidoAceitacaoStatus()
})

</script>

<style scoped lang="scss">

  .botoes-modal {
    align-items: center;
    display: flex;
    justify-content: flex-end;


    .botao-atualizar {
      margin-top: 24px;
      width: 128px;
    }
  }

</style>
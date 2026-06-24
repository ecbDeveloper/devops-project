<template>
    <div v-if="visivel" class="alert" :class="tipo">
      <div class="alert-content">
        <i :class="iconClass"></i>
        <span>{{ mensagem }}</span>
      </div>

      <div class="timeline"></div>
    </div>
</template>

<script setup lang="ts">

const alertStore = useAlertStore()

const mensagem = computed(() => alertStore.getMensagem)
const tipo     = computed(() => alertStore.getTipo)
const visivel  = computed(() => alertStore.getVisivel)

let timeoutId: ReturnType<typeof setTimeout>;

onMounted(() => {
  timeoutId = setTimeout(() => {
    alertStore.fecharAlerta();
  }, 5000);
});

onUnmounted(() => {
  clearTimeout(timeoutId);
});


const iconClass = computed(() => {
  switch (tipo.value) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-times-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    case 'info':
      return 'fas fa-info-circle';
    default:
      return 'fas fa-info-circle';
  }
});

</script>

<style scoped lang="scss">

@keyframes timeline {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.alert {
  align-items: center;
  border-radius: 8px;
  display: flex;
  font-size: 14px;
  height: 60px;
  justify-content: space-between;
  left: 50%;
  margin-bottom: 16px;
  overflow: hidden;
  padding: 12px 16px;
  position: absolute;
  top: 8px;
  transform: translate(-50%);
  width: 320px;
  z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999;


  &.success {
    background-color: $color-primary;
    border: 1px solid color.scale($color-primary, $lightness: -10%);
    color: white;
    z-index: 99999999;
  }

  &.error {
    background-color: $color-error;
    border: 1px solid color.scale($color-error, $lightness: -10%);
    color: white;
    z-index: 99999999;
  }

  &.warning {
    background-color: $color-warning;
    border: 1px solid color.scale($color-warning, $lightness: -10%);
    color: white;
    z-index: 99999999;
  }

  &.info {
    background-color: $color-intercurrences;
    color: white;
    border: 1px solid color.scale($color-intercurrences, $lightness: -10%);
    z-index: 99999999;
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 9999999999999;

    i {
      font-size: 18px;
    }

    span {
      font-size: 16px;
      font-weight: bold;
    }

  }

  .timeline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.5);
    animation: timeline 5s linear forwards;
  }
}
</style>
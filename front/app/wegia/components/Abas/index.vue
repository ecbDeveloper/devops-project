<template>
  <div class="abas-container">
    <div class="abas-wrapper">
      <button v-if="showPrev" class="seta esquerda" @click="scrollTabs(-1)">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div class="abas" ref="abasContainer">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="emit('update:modelValue', FormatString.slugify(tab))"
          :class="{ ativa: FormatString.slugify(String(modelValue)) === FormatString.slugify(tab) }"
        >
          {{ tab }}
        </button>
      </div>

      <button v-if="showNext" class="seta direita" @click="scrollTabs(1)">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="tab-content">
      <slot :name="FormatString.slugify(String(modelValue))"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  modelValue: string | number
  tabs: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const abasContainer = ref<HTMLDivElement | null>(null)
const showPrev = ref(false)
const showNext = ref(false)

const updateArrows = () => {
  if (!abasContainer.value) return
  const container = abasContainer.value
  showPrev.value = container.scrollLeft > 0
  showNext.value =
    container.scrollLeft + container.clientWidth < container.scrollWidth
}

const scrollTabs = (direction: number) => {
  if (!abasContainer.value) return
  const container = abasContainer.value
  const scrollAmount = container.offsetWidth * 0.6
  container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' })
}

onMounted(() => {
  updateArrows()
  window.addEventListener('resize', updateArrows)
  abasContainer.value?.addEventListener('scroll', updateArrows)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateArrows)
  abasContainer.value?.removeEventListener('scroll', updateArrows)
})
</script>

<style scoped lang="scss">

.abas-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  .abas-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0;

    .seta {
      border: none;
      cursor: pointer;
      color: $color-primary;
      font-size: 18px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.esquerda {
        left: 8px;
      }

      &.direita {
        right: 8px;
      }
    }

    .abas {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      width: 100%;
      border-bottom: 2px solid #e0e0e0;
      padding: 0 40px;

      &::-webkit-scrollbar {
        display: none;
      }

      button {
        background: none;
        border: none;
        padding: 12px 16px;
        font-size: 14px;
        color: #666;
        white-space: nowrap;
        flex: 0 0 auto;
        border-bottom: 2px solid transparent;
        transition: color 0.3s, border-color 0.3s;
        cursor: pointer;

        &:hover:not(.ativa) {
          color: $color-primary;
        }
      }

      button.ativa {
        color: $color-primary;
        border-bottom: 2px solid $color-primary;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
    }
  }
}


</style>

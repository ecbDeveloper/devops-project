<template>
  <div class="input-multi-select">
    <div class="input-container">
      <div class="label-button">
        <label :for="label" v-if="label" class="input-multi-select-label">
          {{ label }}
          <span v-if="obrigatorio">*</span>
        </label>
        <button
          v-if="!desabilitado"
          type="button"
          class="add-select"
          @click="adicionarSelect"
        >
          + Adicionar
        </button>
      </div>

      <div class="multi-select-container">
        <div
          v-for="(valor, index) in localValores"
          :key="index"
          class="multi-select-item"
        >
          <select
            v-model="localValores[index]"
            @change="selectChange($event, index)"
            :id="label"
            :disabled="desabilitado"
            :class="{ 'bloqueado': desabilitado }"
          >
            <option value="">Selecionar</option>
            <option
              v-for="o in opcoesLocal"
              :key="o.value"
              :value="o.value"
            >
              {{ o.texto }}
            </option>
          </select>
          <i
            class="fas fa-trash remove-icon"
            v-if="!desabilitado && localValores.length > minimo"
            @click="removerSelect(index)"
          ></i>
        </div>

        <i
          v-if="storeOpcoes?.abrirModal && storeOpcoes?.abrirModal?.length"
          class="fas fa-plus add-icon"
          @click="abrirModal"
        ></i>
      </div>
    </div>

    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Array as () => (string | number)[],
    default: () => ['']
  },
  label: String,
  obrigatorio: Boolean,
  erro: String,
  storeOpcoes: Object,
  desabilitado: {
    type: Boolean,
    default: false
  },
  minimo: {
    type: Number,
    default: 1
  },
  opcoes: {
    type: Array as () => { value: string | number; texto: string }[],
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'select-change'])

const opcoesLocal = computed(() => {
  if (props.storeOpcoes?.stateProp) {
    const { store, stateProp } = props.storeOpcoes
    return store()[stateProp]
  }
  return props.opcoes
})

onMounted(async () => {
  if (props.storeOpcoes?.action) {
    const { store, action } = props.storeOpcoes
    await store()[action]()
  }
})

const localValores = ref([...props.modelValue])

const adicionarSelect = () => {
  localValores.value.push('')
}

const removerSelect = (index: number) => {
  localValores.value.splice(index, 1)
}

const selectChange = (event: Event, index: number) => {
  const valor = (event.target as HTMLInputElement).value
  localValores.value[index] = valor
  emit('select-change', { index, valor })
}

const abrirModal = () => {
  if (props.storeOpcoes?.abrirModal) {
    const { store, abrirModal } = props.storeOpcoes
    store()[abrirModal]()
  }
}

watch(localValores, (newVal) => emit('update:modelValue', newVal), { deep: true })

watch(() => props.modelValue, (newVal) => {
  localValores.value = [...newVal.length ? newVal : Array(props.minimo).fill('')]
}, { deep: true })
</script>

<style scoped lang="scss">
.input-multi-select {
  margin-bottom: 16px;

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @include md {
      align-items: center;
      flex-direction: row;
      gap: 24px;
    }

    .label-button {
      align-items: center;
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      @include md {
        display: block;
      }
    }

    .input-multi-select-label {
      color: $color-octonary;
      margin-bottom: 8px;

      @include md {
        width: 136px;
      }

      span {
        color: $color-error;
      }
    }

    .add-select {
        background: $color-primary;
        border: none;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        padding: 8px 16px;
        font-size: 14px;

        &:hover {
          background: color.scale($color-primary, $lightness: -10%);
        }
      }

    .multi-select-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;

      .multi-select-item {
        display: flex;
        align-items: center;
        gap: 8px;

        select {
          appearance: none;
          background-color: $color-tertiary;
          border: 1px solid $color-octonary;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          height: 48px;
          padding: 0 16px;
          width: 100%;
        }

        select.bloqueado {
          cursor: not-allowed;
        }

        .remove-icon {
          color: $color-error;
          cursor: pointer;
          font-size: 16px;

          &:hover {
            color: color.scale($color-error, $lightness: -10%);
          }
        }
      }

      .add-icon {
        color: $color-primary;
        cursor: pointer;
        font-size: 16px;
        margin-top: 4px;
        transition: color 0.2s, transform 0.2s;

        &:hover {
          color: color.scale($color-primary, $lightness: -10%);
          transform: rotate(135deg);
        }
      }
    }
  }

  .erro {
    color: $color-error;
    font-size: 14px;
  }
}
</style>

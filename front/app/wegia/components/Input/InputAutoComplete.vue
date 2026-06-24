<template>
  <div class="input">
    <div class="input-auto-complete">
      <label :for="textoVisualizado" v-if="label">{{ label }}<span v-if="obrigatorio">*</span></label>
      <div class="container-input">
        <input
          type="text"
          :id="textoVisualizado"
          :placeholder="placeholder"
          :class="styleInput"
          :value="textoVisualizado"
          @input="handleInput"
          @focus="visualizarSugestoes = true"
          @blur="hideSuggestions"
          :disabled="bloqueado || desabilitado"
          :maxlength="max"
        />
        <ul v-if="visualizarSugestoes && texto.length > 1">
          <li
            v-for="(item, index) in sugestoesFiltradas"
            :key="index"
            @mousedown.prevent="selectSuggestion(item)"
          >
            {{ item.texto }}
          </li>
        </ul>
      </div>
    </div>
    <span class="icon" v-if="icon">
      <i :class="icon"></i>
    </span>
    <p class="erro" v-show="erro">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Sugestao {
  value: string
  texto: string
}

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: '' },
  erro: { type: String, default: '' },
  bloqueado: { type: Boolean, default: false },
  desabilitado: { type: Boolean, default: false },
  storeOpcoes: Object,
  max: Number,
  blur: Function,
  obrigatorio: Boolean,
  icon: String,
  label: String,
  regex: RegExp,
})

const emit = defineEmits(['update:modelValue', 'update:erro'])

const visualizarSugestoes = ref(false)
const sugestoes = ref<Sugestao[]>([])
const texto = ref('')

const textoVisualizado = computed(() => {
  const selected = sugestoes.value.find(s => s.value === props.modelValue)
  return selected ? selected.texto : texto.value
})

const sugestoesFiltradas = computed(() =>
  sugestoes.value.filter(s =>
    s.texto.toLowerCase().includes((textoVisualizado.value || '').toLowerCase())
  )
)

const styleInput = computed(() => {
  let classe = ''
  if (props.icon) classe = 'espacamentoNaEsquerda '
  if (props.bloqueado || props.desabilitado) classe += 'bloqueado '
  return classe
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  if (props.regex) value = value.replace(props.regex, '')

  texto.value = value
  emit('update:modelValue', '')
}

const selectSuggestion = (item: Sugestao) => {
  emit('update:modelValue', item.value)
  texto.value = ''
  visualizarSugestoes.value = false
}

const hideSuggestions = () => {
  setTimeout(() => {
    visualizarSugestoes.value = false
  }, 200)
}

onMounted(() => {
  if (props.storeOpcoes) {
    const { store, stateProp } = props.storeOpcoes
    sugestoes.value = store()[stateProp] || []
  }
})
</script>

<style scoped lang="scss">
.input {
  margin-bottom: 24px;
  position: relative;

  .input-auto-complete {
    display: flex;
    flex-direction: column;
    gap: 8px;

    @include md {
      align-items: center;
      flex-direction: row;
      gap: 24px;
    }

    label {
      color: $color-octonary;
      padding-left: 4px;

      @include md {
        width: 136px;
      }

      @include md {
        padding-left: 0px;
      }

      span {
        color: $color-error;
      }
    }

    .container-input {
      position: relative;
      width: 100%;

      input {
        background-color: $color-tertiary;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        height: 48px;
        padding: 0 16px;
        width: 100%;

        &.espacamentoNaEsquerda {
          padding-left: 56px;
        }

        &:focus {
          border-color: $color-primary;
          box-shadow: 0 0 6px rgba($color-primary, 0.4);
          outline: none;
        }
      }
    }

    input.bloqueado {
      cursor: not-allowed;
    }

    ul {
      list-style: none;
      top: 48px;
      margin: 0;
      padding: 0;
      position: absolute;
      width: 100%;
      max-height: 250px;
      overflow-y: auto;
      z-index: 99;

      li {
        background: $color-tertiary;
        cursor: pointer;
        padding: 4px;

        &:hover {
          background: $color-primary;
          color: white;
        }
      }
    }
  }

  .icon {
    border-right: 1px solid $color-septenary;
    color: $color-primary;
    left: 12px;
    padding-right: 16px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  p {
    font-size: 14px;
    color: $color-error;
    margin-left: 8px;
  }
}
</style>

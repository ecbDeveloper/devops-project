<template>
  <div class="input">
    <div class="input-text">
      <label v-if="label">{{ label }}<span v-if="obrigatorio">*</span></label>

      <div
        v-for="(arquivo, index) in arquivosInternos"
        :key="index"
        class="file-container"
        :class="estiloInput"
      >
        <input
          type="file"
          class="file-input"
          :disabled="bloqueado || desabilitado"
          @change="(e) => aoMudarArquivo(e, index)"
          :accept="aceitar"
          ref="inputsArquivos"
        />
        <span class="file-placeholder">
          {{ arquivo?.name || placeholder }}
        </span>
        <button
          class="botao-limpar"
          @click.stop="removerArquivo(index)"
          type="button"
        >✕</button>
      </div>

      <button
        type="button"
        class="botao-adicionar"
        @click="adicionarArquivo"
        :disabled="bloqueado || desabilitado"
      >
        + Adicionar arquivo
      </button>
    </div>
    <p class="erro" v-show="erro">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as () => (File | null)[],
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Selecione um arquivo'
  },
  erro: {
    type: String,
    default: ''
  },
  bloqueado: {
    type: Boolean,
    default: false
  },
  desabilitado: {
    type: Boolean,
    default: false
  },
  obrigatorio: Boolean,
  label: String,
  aceitar: String
})

const emit = defineEmits(['update:modelValue', 'update:erro'])

const arquivosInternos = ref<(File | null)[]>([])

watch(
  () => props.modelValue,
  val => {
    arquivosInternos.value = val.length ? val : [null]
  },
  { immediate: true }
)

const estiloInput = computed(() => {
  return props.bloqueado || props.desabilitado ? 'bloqueado' : ''
})

const aoMudarArquivo = (evento: Event, idx: number) => {
  const alvo = evento.target as HTMLInputElement
  const arquivo = alvo.files ? alvo.files[0] : null
  arquivosInternos.value[idx] = arquivo
  emitirAlteracao()
}

const removerArquivo = (idx: number) => {
  arquivosInternos.value.splice(idx, 1)
  if (arquivosInternos.value.length === 0) {
    arquivosInternos.value.push(null)
  }
  emitirAlteracao()
}

const adicionarArquivo = () => {
  arquivosInternos.value.push(null)
}

const emitirAlteracao = () => {
  const arquivosValidos = arquivosInternos.value.filter((a): a is File => !!a)
  emit('update:modelValue', arquivosValidos)
}
</script>

<style scoped lang="scss">
.input {
  margin-bottom: 24px;
  position: relative;

  .input-text {
    display: flex;
    flex-direction: column;
    gap: 12px;

    label {
      color: $color-octonary;

      @include md {
        width: 136px;
      }

      span {
        color: $color-error;
      }
    }

    .file-container {
      position: relative;
      display: flex;
      align-items: center;
      background-color: $color-tertiary;
      border-radius: 8px;
      height: 48px;
      width: 100%;
      cursor: pointer;
      overflow: hidden;
      padding: 0 16px;

      &.bloqueado {
        cursor: not-allowed;
        background-color: $color-septenary;
      }
    }

    .file-input {
      cursor: pointer;
      height: 100%;
      opacity: 0;
      position: absolute;
      width: 90%;
    }

    .file-placeholder {
      flex-grow: 1;
      color: $color-primary;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .botao-limpar {
      background: none;
      border: none;
      cursor: pointer;
      color: $color-error;
      font-size: 18px;
      margin-left: 10px;
    }

    .botao-adicionar {
      margin-top: 8px;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      background-color: $color-primary;
      color: white;
      font-weight: 600;
      cursor: pointer;
      width: 250px;

      &:disabled {
        background-color: $color-septenary;
        cursor: not-allowed;
      }
    }
  }

  p.erro {
    color: $color-error;
    font-size: 14px;
    margin-left: 8px;
  }
}
</style>

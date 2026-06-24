<template>
    <div class="input-time">
      <div class="input-container">
        <label :for="label" v-if="label" class="input-time-label">
          {{ label }}
          <span v-if="obrigatorio">*</span>
        </label>

        <div class="input-container">
          <input
            :id="label"
            v-model="tempoFormatado"
            :disabled="bloqueado"
            :class="{'bloqueado': bloqueado}"
            @input="inserindoTempo"
            :placeholder="placeholder || 'HH:mm'"
            type="text"
            maxlength="5"
          />
        </div>

        <p v-if="erro" class="erro">{{ erro }}</p>
      </div>
    </div>
  </template>

<script setup lang="ts">

const props = defineProps({
    modelValue: String,
    label: String,
    obrigatorio: Boolean,
    erro: String,
    placeholder: String,
    bloqueado: {
      type: Boolean,
      default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const tempoFormatado = ref<string>('');

const inserindoTempo = () => {
    let value = tempoFormatado.value;

    let tempoLimpo = value.replace(/\D/g, '');

    if (tempoLimpo.length > 4) {
        tempoLimpo = tempoLimpo.substring(0, 4);
    }

    if (tempoLimpo.length >= 2) {
        const horas = Number.parseInt(tempoLimpo.substring(0, 2), 10);
        if (horas > 23) {
            tempoLimpo = '23' + tempoLimpo.substring(2);
        }
    }

    if (tempoLimpo.length >= 4) {
        const minutos = Number.parseInt(tempoLimpo.substring(2), 10);
        if (minutos > 59) {
            tempoLimpo = tempoLimpo.substring(0, 2) + '59';
        }
    }

    let tempoFormatadoFinal = tempoLimpo;
    if (tempoLimpo.length > 2) {
        tempoFormatadoFinal = `${tempoLimpo.substring(0, 2)}:${tempoLimpo.substring(2)}`;
    }

    tempoFormatado.value = tempoFormatadoFinal;
    emit('update:modelValue', tempoFormatadoFinal);
};

onMounted(() => {
    if (props.modelValue) {
        tempoFormatado.value = props.modelValue;
    }
});

watch(
  () => props.modelValue, (newValue, oldValue) => {
    if(newValue !== tempoFormatado.value && newValue) {
      tempoFormatado.value = newValue
    }
  }
)
</script>

  <style scoped lang="scss">
  .input-time {
    margin-bottom: 16px;

    .input-container {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 8px;

        .input-time-label {
            color: $color-octonary;
            display: block;
            margin-bottom: 8px;

            @include md {
              width: 136px;
            }

            span {
            color: $color-error;
            }
        }

        input {
            appearance: none;
            background-color: $color-tertiary;
            border: 1px solid $color-octonary;
            border-radius: 8px;
            font-size: 16px;
            height: 48px;
            padding: 0 16px;
            transition: border 0.2s, box-shadow 0.2s;
            width: 100%;

            &:focus {
            border-color: $color-primary;
            outline: none;
            }
        }
    }

    .erro {
        font-size: 14px;
        color: $color-error;
    }

    .bloqueado {
        cursor: not-allowed;
    }
  }
  </style>

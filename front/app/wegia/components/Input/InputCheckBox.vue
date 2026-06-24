<template>
    <div class="input-checkbox">
      <div class="input-container">
        <label v-if="label" class="input-checkbox-label">
          {{ label }}
          <span v-if="obrigatorio">*</span>
        </label>

        <div class="checkbox-container">
          <div v-for="(opcao, index) in opcoes" :key="index" class="checkbox-item">
            <input
              type="checkbox"
              :id="'checkbox-' + opcao.value"
              :checked="modelValue?.split(',').includes(opcao.value.toString())"
              @change="onCheckboxChange(opcao.value)"
              :disabled="bloqueado || desabilitado"
              :class="{'bloqueado': bloqueado || desabilitado}"
            />
            <label :for="'checkbox-' + opcao.value">{{ opcao.texto }}</label>
          </div>
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
    desabilitado: {
      type: Boolean,
      default: false
    },
    bloqueado: {
      type: Boolean,
      default: false
    },
    opcoes: {
      type: Array as () => { texto: string, value: string | number }[],
      required: true
    }
  });

const emit = defineEmits(['update:modelValue']);

const onCheckboxChange = (value: string | number) => {
  let novoValor = props.modelValue ? props.modelValue.split(',') : [];

  if (novoValor.includes(value.toString())) {
      novoValor = novoValor.filter(item => item !== value.toString());
  } else {
      novoValor.push(value.toString());
  }

  emit('update:modelValue', novoValor.join(','));
  };


</script>

<style scoped lang="scss">
  .input-checkbox {
    margin-bottom: 16px;

    .input-container {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 8px;

        .input-checkbox-label {
            color: $color-octonary;
            display: block;

            @include md {
              width: 136px;
            }

            span {
                color: $color-error;
            }
        }

        .checkbox-container {
            display: flex;
            flex-direction: row;
            gap: 8px;

            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 8px;

                input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                input.bloqueado {
                    cursor: not-allowed;
                }

                label {
                    font-size: 16px;
                }
            }
        }
    }

    .erro {
      font-size: 14px;
      color: $color-error;
    }


}
</style>

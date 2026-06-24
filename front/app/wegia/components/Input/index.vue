<template>
    <component
      :is="inputComponent"
      v-bind="$props"
      @update:modelValue="$emit('update:modelValue', $event)"
      @update:erro="$emit('update:erro', $event)"
    />
</template>

<script setup lang="ts">
import InputCheckBox from './InputCheckBox.vue';
import InputFile from './InputFile.vue';
import InputRadioButton from './InputRadioButton.vue';
import InputSelect from './InputSelect.vue';
import InputMultiSelect from './InputSelectMultiple.vue';
import InputText from './InputText.vue';
import InputTextArea from './InputTextArea.vue';
import InputTime from './InputTime.vue';
import InputAutoComplete from './InputAutoComplete.vue'
import InputMultipleFile from './InputMultipleFile.vue'

const props = defineProps({
    modelValue: [String, Boolean, Number],
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        deafult: ''
    },
    erro: {
        type: String,
        default: ''
    },
    bloqueado: {
      type: Boolean,
      default: false
    },
    desabilitado: Boolean,
    obrigatorio: Boolean,
    icon: String,
    mask: {
      type: [String, Function] as any,
      default: null
    },
    regex: RegExp,
    opcoes: Array as () => { value: string, texto?: string, icon?: string }[]
});

const inputComponent = computed(() => {
    switch (props.type) {
      case 'radio':
        return InputRadioButton;
      case 'select':
        return InputSelect
      case 'selectMultiple':
        return InputMultiSelect
      case 'time':
        return InputTime
      case 'checkbox':
        return InputCheckBox
      case 'file':
        return InputFile
      case 'textarea':
        return InputTextArea
      case 'autoComplete':
        return InputAutoComplete
      case 'multipleFile':
        return InputMultipleFile
      default:
        return InputText;
    }
});
</script>

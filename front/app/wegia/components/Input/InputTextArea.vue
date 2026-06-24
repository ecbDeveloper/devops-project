<template>
    <div class="input">
        <div class="input-text">
            <label v-if="label">{{ label }}<span v-if="obrigatorio">*</span></label>
            <textarea
                :placeholder="placeholder"
                :class="styleInput"
                :value="modelValue"
                @input="handleInput"
                @blur="perdeuFoco"
                :disabled="bloqueado || desabilitado"
                :maxlength="max"
                :rows="rows"
            ></textarea>
        </div>
        <p class="erro" v-show="erro">{{ erro }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    modelValue: String,
    placeholder: {
        type: String,
        default: ''
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
    max: Number,
    blur: Function,
    obrigatorio: Boolean,
    label: String,
    rows: {
        type: Number,
        default: 4
    }
});

const emit = defineEmits(['update:modelValue', 'update:erro']);

const perdeuFoco = async () => {
    if (props.blur) {
        const erro = await props.blur(props.modelValue);
        emit('update:erro', erro);
    }
};

const styleInput = computed(() => {
    let classe = '';
    if (props.bloqueado || props.desabilitado) {
        classe += "bloqueado ";
    }
    return classe;
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
};
</script>

<style scoped lang="scss">
.input {
    margin-bottom: 24px;
    position: relative;

    .input-text {
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
            color: $color-octonary;
            width: 100%;

            span {
                color: $color-error;
            }
        }

        textarea {
            background-color: $color-tertiary;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            padding: 12px;
            width: 100%;
            resize: vertical;

            &:focus {
                border-color: $color-primary;
                box-shadow: 0 0 6px rgba($color-primary, 0.4);
                outline: none;
            }
        }

        textarea.bloqueado {
            cursor: not-allowed;
        }
    }

    p.erro {
        color: $color-error;
        font-size: 14px;
        margin-left: 8px;
    }
}
</style>

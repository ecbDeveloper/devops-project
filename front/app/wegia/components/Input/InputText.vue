<template>
    <div class="input">
        <div class="input-text">
            <label :for="label" v-if="label">{{ label }}<span v-if="obrigatorio">*</span></label>
            <input
                :id="label"
                :type="type"
                :placeholder="placeholder"
                :class="styleInput"
                :value="modelValue"
                @input="handleInput"
                @blur="perdeuFoco"
                :disabled="bloqueado || desabilitado"
                :maxlength="max"
            />
        </div>
        <span class="icon" v-if="icon">
            <i :class="icon"></i>
        </span>
        <p class="erro" v-show="erro">{{ erro }}</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    modelValue: String,
    type: {
        type: String,
        deafult: 'text'
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
    desabilitado: {
        type: Boolean,
        default: false
    },
    max: Number,
    blur: Function,
    obrigatorio: Boolean,
    icon: String,
    label: String,
    mask: {
        type: [String, Function] as any,
        default: null
    },
    regex: RegExp
})

const emit = defineEmits(['update:modelValue', 'update:erro']);

const perdeuFoco = async () => {
    if(props.blur) {
        const erro = await props.blur(props.modelValue)
        emit('update:erro', erro)
    }
}

const styleInput = computed(() => {
    let classe = '';
    if(props.icon) {
        classe = "espacamentoNaEsquerda ";
    }

    if(props.bloqueado || props.desabilitado) {
        classe = classe + "bloqueado "
    }

    return classe
})

const handleInput = (event: Event) => {
    let target = event.target as HTMLInputElement;
    let value = target.value;

    if (props.regex) {
        value = value.replace(props.regex, '');
    }

    if (props.mask) {
        value = Mascara.aplicar(value, props.mask);
    }

    if (value === props.modelValue) {
        emit('update:modelValue', value + ' ');
        setTimeout(() => emit('update:modelValue', value.trim()), 0);
    } else {
        emit('update:modelValue', value);
    }
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

        input.bloqueado {
            cursor:not-allowed;
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
        color: $color-error;
        font-size: 14px;
        margin-left: 8px;
        white-space: break-spaces;
    }
}

</style>
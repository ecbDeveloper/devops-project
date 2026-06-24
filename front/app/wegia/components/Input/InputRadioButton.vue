<template>
    <div class="input-radio">
        <label v-if="label" class="input-radio-label">
            {{ label }}
            <span v-if="obrigatorio">*</span>
        </label>

        <div class="radio-opcoes">
            <label
                v-for="o in opcoes"
                :key="o.value"
                class="radio-label"
                :class="{'bloqueado': bloqueado || desabilitado}"
            >
                <input
                    type="radio"
                    :value="o.value"
                    :checked="o.value === modelValue"
                    :disabled="bloqueado || desabilitado"
                    :class="{'bloqueado': bloqueado || desabilitado}"
                    @change="handleChange(o.value)"
                />

                <span v-if="o.icon" class="icon">
                    <i :class="o.icon"></i>
                </span>

                <span v-if="o.texto">{{ o.texto }}</span>
            </label>
        </div>

        <p class="erro" v-show="erro">{{ erro }}</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    modelValue: String,
    label: String,
    obrigatorio: Boolean,
    erro: String,
    desabilitado: Boolean,
    bloqueado: {
        type: Boolean,
        required: false
    },
    opcoes: {
        type: Array as () => { value: string, texto?: string, icon?: string }[],
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (value: string) => {
    emit('update:modelValue', value);
};

</script>

<style scoped lang="scss">

.input-radio {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;

    @include md {
        flex-direction: row;
        gap: 24px;
    }

    .input-radio-label {
        color: $color-octonary;
        display: block;
        margin-bottom: 8px;
        min-width: 120px;

        span {
            color: $color-error;
        }
    }

    .radio-opcoes{
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .radio-label {
        align-items: center;
        cursor: pointer;
        display: flex;
        gap: 8px;
    }

    input[type="radio"].bloqueado,
    .radio-label.bloqueado {
        cursor:not-allowed;
    }

    input[type="radio"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid $color-primary;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:checked {
            background-color: $color-primary;
        }
    }

    .icon {
        font-size: 18px;
        color: $color-primary;
    }

    .erro {
        color: $color-error;
        font-size: 14px;
    }
}

</style>

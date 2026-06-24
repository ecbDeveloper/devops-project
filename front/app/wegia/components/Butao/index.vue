<template>

    <button
        :type="type"
        @click="handleClick"
        :class="['botao', { bloqueado }, classExtra]"
        :disabled="bloqueado"
    >
        {{ texto }}
    </button>

</template>

<script setup lang="ts">

defineProps({
    texto: String,
    classExtra: String,
    type: {
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button'
    },
    bloqueado: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click-botao']);

const handleClick = () => {
  emit('click-botao');
};

</script>

<style scoped lang="scss">

button {
    background-color: $color-primary;
    border-radius: 8px;
    color: $color-tertiary;
    height: 32px;
    width: 100%;
}

button.erro {
    background: $color-error;
}

button.sucesso {
    background: $color-success;
}

.bloqueado {
    cursor:not-allowed;
}
</style>
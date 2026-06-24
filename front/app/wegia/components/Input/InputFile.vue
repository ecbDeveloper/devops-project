<template>
    <div class="input">
        <div class="input-text">
            <label for="arquivo-imagem" v-if="label">{{ label }}<span v-if="obrigatorio">*</span></label>
            <div class="file-container" :class="styleInput">
                <input
                    type="file"
                    ref="fileInput"
                    class="file-input"
                    :disabled="bloqueado || desabilitado"
                    @change="handleFileChange"
                    :accept="accept"
                    id="arquivo-imagem"
                />
                <span class="file-placeholder">
                    {{ nomeArquivo || placeholder }}
                </span>
                <button v-if="nomeArquivo" class="clear-btn" @click="limparArquivo">✕</button>
            </div>
        </div>
        <p class="erro" v-show="erro">{{ erro }}</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    modelValue: File | null,
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
    accept: String
});

const emit = defineEmits(['update:modelValue', 'update:erro']);

const fileInput = ref<HTMLInputElement | null>(null);
const nomeArquivo = computed(() => props.modelValue?.name || '');

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    emit('update:modelValue', file);
};

const limparArquivo = (event: Event) => {
    event.stopPropagation();
    emit('update:modelValue', null);
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const styleInput = computed(() => {
    return props.bloqueado || props.desabilitado ? 'bloqueado' : '';
});
</script>

<style scoped lang="scss">
.input {
    margin-bottom: 24px;
    position: relative;

    .input-text {
        align-items: center;
        display: flex;
        gap: 24px;

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

        .clear-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: $color-error;
            font-size: 18px;
            margin-left: 10px;
        }
    }

    p.erro {
        font-size: 14px;
        color: $color-error;
        margin-left: 8px;
    }
}
</style>

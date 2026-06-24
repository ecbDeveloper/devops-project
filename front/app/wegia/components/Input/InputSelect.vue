<template>
    <div class="input-select">
        <div class="input-container">
            <label :for="label" v-if="label" class="input-select-label">
                {{ label }}
                <span v-if="obrigatorio">*</span>
            </label>

            <div class="select-container">
                <select :id=label  v-model="selectedValue" @change="selectChange" :disabled="desabilitado || bloqueado" :class="{'bloqueado': desabilitado || bloqueado}">
                    <option value="">{{ opcaoDefault }}</option>
                    <option
                        v-for="o in opcoesLocal"
                        :key="o.value"
                        :value="o.value"
                    >
                        {{ o.texto }}
                    </option>
                </select>
                <i class="fas fa-chevron-down dropdown-icon"></i>
                <div
                    v-if="!storeOpcoes?.permissao || pessoaStore.possuiPermissao(storeOpcoes?.permissao)"
                >
                    <i
                        v-if="!desabilitado && !bloqueado && storeOpcoes?.abrirModal && storeOpcoes?.abrirModal?.length"
                        class="fas fa-plus add-icon"
                        @click="abrirModal"
                    >
                    </i>
                </div>
            </div>

        </div>
        <p v-if="erro" class="erro">{{ erro }}</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    modelValue: [String, Number] as PropType<string | number>,
    label: String,
    obrigatorio: Boolean,
    erro: String,
    storeOpcoes: Object,
    desabilitado: {
        type: Boolean,
        default: false
    },
    bloqueado: {
        type: Boolean,
        default: false
    },
    opcoes: {
        type: Array as () => { value: string | number, texto: string }[],
    },
    opcaoDefault: {
        type: String,
        default: 'Selecionar'
    }
});
const emit = defineEmits(['update:modelValue', 'select-change']);

const pessoaStore = usePessoaStore()

const opcoesLocal = computed(() => {
    let opt;
    if (props.storeOpcoes && props.storeOpcoes.stateProp) {
        const { store, stateProp } = props.storeOpcoes;

        opt =  store()[stateProp]
    } else {
        opt = props.opcoes
    }

    return opt
})

const selectChange = (event: Event) => {
    const valor = (event.target as HTMLInputElement).value
    emit("select-change", valor)
}

onMounted(async () => {
    if (props.storeOpcoes && props.storeOpcoes.action) {
        const { store, action } = props.storeOpcoes;

        await store()[action]()
    }
});

const selectedValue = computed({
    get: () => props.modelValue,
    set: (value: string) => emit("update:modelValue", value)
});

const abrirModal = () => {
    if (props.storeOpcoes) {
        const { store, abrirModal } = props.storeOpcoes;

        store()[abrirModal]()
    }
}

</script>

<style scoped lang="scss">

.input-select {
    margin-bottom: 16px;

    .input-container {
        align-items: flex-start;
        display: flex;
        flex-direction: column;

        @include md {
            align-items: center;
            flex-direction: row;
            gap: 24px;
        }

        .input-select-label {
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

        .select-container {
            align-items: center;
            display: flex;
            position: relative;
            width: 100%;

            select {
                appearance: none;
                background-color: $color-tertiary;
                border: 1px solid $color-octonary;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                height: 48px;
                padding: 0 16px;
                padding-right: 40px;
                transition: border 0.2s, box-shadow 0.2s;
                width: 100%;

                &:focus {
                    border-color: $color-primary;
                    border-end-end-radius: 0px;
                    border-end-start-radius: 0px;
                    box-shadow: 0 0 6px rgba($color-primary, 0.4);
                    outline: none;
                }
            }

            select.bloqueado {
                cursor:not-allowed;
            }

            .dropdown-icon {
                color: $color-octonary;
                pointer-events: none;
                position: absolute;
                right: 32px;
                transition: transform 0.2s;
            }
        }

        .add-icon {
            color: $color-primary;
            cursor: pointer;
            font-size: 16px;
            margin-left: 8px;
            transition: color 0.2s, transform 0.2s;

            &:hover {
                color: color.scale($color-primary, $lightness: -10%);
                transform: rotate(180deg)
            }
        }
    }

    .erro {
        color: $color-error;
        font-size: 14px;
    }
}

</style>

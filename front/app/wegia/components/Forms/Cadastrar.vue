<template>
    <div class="cadastrar">
        <BreadCrumbTimeLine 
            :steps=etapas
            :currentStep="etapaAtual"
            @navigate="handleStepChange"
        />

        <div class="form-container">


            <div class="formularios">
                
                <slot />
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    etapaAtual: {
        type: Number,
        default: 1
    },
    etapas: {
        type: Array<{ label: string; icon: string }>,
        required: true
    }
})

const emit = defineEmits(['stepChange'])


const handleStepChange = (index: number) => {
    if(index + 1 <= props.etapaAtual) {
        emit('stepChange', index + 1)
    }
}

</script>

<style scoped lang="scss">

.cadastrar {

    .form-container {
        display: flex;
        gap: 24px;
        flex-direction: column;

        @include md {
            flex-direction: row;
            padding: 48px;
        }

        .input-file-com-visualizacao {
            width: 100%;

            @include md {
                width: 250px;
            }
        }

        .formularios {
            width: 100%;
        }
    }

}

</style>
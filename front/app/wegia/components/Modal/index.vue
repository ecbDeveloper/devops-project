<template>

<div class="modal-container" @click="fechar">
    <div class="modal" @click.stop="">
        <i class="fas fa-times fechar-modal" @click="fechar" v-if="aparecerX"></i>
        <slot />
    </div>
</div>

</template>

<script setup lang="ts">

withDefaults(
  defineProps<{
    aparecerX?: boolean
  }>(),
  {
    aparecerX: true
  }
)

const emit = defineEmits(['fecharModal']);

const fechar = () =>  {
    emit('fecharModal')
}



</script>

<style scoped lang="scss">

.modal-container {
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    height: 100vh;
    left: 0px;
    overflow: auto;
    position: fixed;
    top: 0px;
    width: 100vw;
    z-index: 99999;

    .modal {
        background-color: $color-white;
        border-radius: 8px;
        margin: auto;
        overflow: auto;
        padding: 24px;
        position: relative;

        .fechar-modal {
            cursor: pointer;
            font-size: 20px;
            position: absolute;
            right: 24px;
        }
    }
}

</style>
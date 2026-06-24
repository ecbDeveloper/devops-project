<template>

    <div class="lista-de-dados">
        <div class="titulo">
            <h2>{{ titulo }}</h2>
        </div>

        <div class="corpo">
            
            <slot />
        </div>
    </div>

</template>

<script setup lang="ts">

const props = defineProps({
    titulo: String
})

</script>

<style scoped lang="scss">

.lista-de-dados {
    .titulo {
        background-color: $color-tertiary;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
        padding: 24px;
    }

    .corpo {
        background-color: $color-white;
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        height: auto;
        padding: 24px;
    }
}

</style>
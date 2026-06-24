<template>
    <div class="box">
        <i :class="icone"></i>

        <p>{{ texto }}</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    icone: String,
    texto: String
})

</script>

<style scoped lang="scss">

.box {
    align-items: center;
    background-color: $color-white;
    border-radius: 24px;
    border: 1px solid $color-black;
    color: $color-primary;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-size: 24px;
    gap: 16px;
    justify-content: center;
    height: 180px;
    width: 180px;

    &:hover {
        color: $color-primary-opacity;
    }

    i {
        font-size: 56px;
    }

    p {
        text-align: center;
    }
}

</style>
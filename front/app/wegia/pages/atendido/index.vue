<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ATENDIDO)">Você não possui permissão!</h2>
    <section class="atendido" v-else>

        <TabelaAtendido />

    </section>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_ATENDIDO
})

const pessoaStore = usePessoaStore()

</script>

<style scoped lang="scss">

.atendido {

    @include sm {
        padding: 48px;
    }
}

</style>
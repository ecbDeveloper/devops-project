<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_MEDICAMENTO)">Você não possui permissão!</h2>
    <div class="cadastrar-medicamento" v-else>

        <FormsPetMedicamento/>

    </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_MEDICAMENTO
})

const pessoaStore = usePessoaStore()
const menuSectionStore = useMenuSectionStore()

menuSectionStore.setTitulo("Cadastrar Medicamento")
menuSectionStore.setComplemento("")

</script>


<style lang="scss">

.cadastrar-medicamento {
  padding: 12px;

    @include lg {
        padding: 48px;
    }
}

</style>
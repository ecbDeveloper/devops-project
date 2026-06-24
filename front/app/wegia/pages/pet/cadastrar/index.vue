<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_PET)">Você não possui permissão!</h2>
    <div class="cadastrar-pet" v-else>

        <FormsPet
            @enviar-form="cadastrar"
        />

    </div>
</template>

<script setup lang="ts">

import { enviarCadastroPet } from '~/forms/pet/cadastrarPet';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_PET
})

const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()

menuSectionStore.setTitulo("Cadastrar Pet")
menuSectionStore.setComplemento("Digite o identificador do pet")

const cadastrar = async ({ formulario, imagemForm } : any) => {
    await enviarCadastroPet(formulario, imagemForm)
}

</script>

<style scoped lang="scss">

.cadastrar-pet {
    padding: 12px;

    @include lg {
        padding: 24px;
    }

}

</style>

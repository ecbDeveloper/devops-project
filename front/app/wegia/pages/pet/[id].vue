<template>
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_PET)">Você não possui permissão!</h2>
    <div class="pet-id" v-else>
        <Loading v-if="loading" class="loading" />
        <Abas v-model="abaAberta" :tabs="abas" v-else >
            <template #pet>
                <FormsPet
                  :pet="pet"
                  @enviar-form="atualizarPetLocal"
                />
            </template>

            <template #ficha>
              <FormsPetFichaMedica
                :ficha="pet.ficha_medica"
                :id="pet.id_pet"
                @atualizar-infos="buscarPet"
              />
            </template>

            <template #atendimento>
              <TabelaPetAtendimento
                v-if="pet?.ficha_medica?.id_ficha_medica"
                :id_ficha_medica="pet?.ficha_medica?.id_ficha_medica"
              />

              <h3 v-else>Cadastre uma ficha medica primeiro, na aba ficha </h3>
            </template>

            <template #adocao>
              <FormsPetAdocao
                :id="pet.id_pet"
                :adotante="pet.adocao"
                @atualizar-infos="buscarPet"
              />
            </template>
        </Abas>
    </div>

</template>

<script setup lang="ts">

import { atualizarPet } from '~/forms/pet/cadastrarPet';

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_PET
})

const route = useRoute()
const petStore = usePetStore()
const pessoaStore = usePessoaStore()

const id = Number(route.params.id)

const pet = computed(() => petStore.getPet)

const abas = ref(['Pet', 'Ficha', 'Atendimento', 'Adoção'])
const abaAberta = ref('Pet')
const loading = ref(true)

const atualizarPetLocal = async ({formulario, imagemForm}: any) => {
  await atualizarPet(pet.value.id_pet, formulario, imagemForm)
}

const buscarPet = async () => {
  loading.value = true
  await petStore.fetchPet(id)
  loading.value = false
}

onMounted(async () => {
  await buscarPet()
  await pessoaStore.fetchParaFiltro()
})

</script>

<style scoped lang="scss">

.pet-id {

  padding: 8px;

  @include md {
    padding: 24px;
  }
}

</style>
<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_MEDICAMENTO)">Você não possui permissão!</h2>
  <div class="atualizar-medicamento" v-else>

      <FormsPetMedicamento
        :medicamento=medicamento
        v-if="!loading"
      />

      <Loading v-else />

  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MEDICAMENTO
})

const route = useRoute()
const menuSectionStore = useMenuSectionStore()
const petMedicamentoStore = usePetMedicamentoStore()
const pessoaStore = usePessoaStore()

const id = Number(route.params.id)

menuSectionStore.setTitulo("Atualizar Medicamento")
menuSectionStore.setComplemento("")

const medicamento = computed(() => petMedicamentoStore.getMedicamento)

const loading = ref(true)

const buscarMedicamento = async() => {
  loading.value = true
  await petMedicamentoStore.fetchMedicamento(id)
  loading.value = false
}

buscarMedicamento()

</script>

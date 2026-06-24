<template>

  <section class="ficha-medica-id">

    <Loading v-if="loading" />

    <Abas v-model="abaAberta" :tabs="abas" v-else >
        <template #informacoes-gerais >
            <section-pet-informacoes-gerais
              :ficha="ficha"
              @buscar-ficha="buscarFicha"
            />
        </template>

        <template #alergias >
            <tabela-saude-alergias
              :fichaId="id"
            />
        </template>

        <template #comorbidades >
            <tabela-saude-comorbidade
              :fichaId="id"
            />
        </template>

        <template #exames >
            <tabela-saude-exames
              :fichaId="id"
            />
        </template>

        <template #atendimentos>
          <tabela-saude-atendimento
            :fichaId="id"
          />
        </template>

        <template #medicamentos >
          <tabela-saude-medicacao
            :fichaId="id"
          />
        </template>

        <template #sinais-vitais >
          <tabela-saude-sinal-vital
            :fichaId="id"
          />
        </template>

        <template #intercorrencia >
          <tabela-saude-intercorrencia
            :fichaId="id"
          />
        </template>

    </Abas>

  </section>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_FICHA_MEDICA
})

const route = useRoute()
const fichaMedicaStore = useSaudeFichaMedicaStore()
const pessoaStore = usePessoaStore()

const id = Number(route.params.id)

const abaAberta = ref('informacoes gerais')
const loading = ref(true)

const abas = computed(() => {
  const abasLocal = ['Informacoes gerais']

  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ALERGIA_NA_FICHA_MEDICA)) abasLocal.push('Alergias')
  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ENFERMIDADE)) abasLocal.push('Comorbidades')
  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_EXAME)) abasLocal.push('Exames')
  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ATENDIMENTO)) abasLocal.push('Atendimentos')
  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_MEDICACAO)) abasLocal.push('Medicamentos')
  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_SINAIS_VITAIS)) abasLocal.push('Sinais Vitais')
  if(pessoaStore.possuiPermissao(Permissao.VISUALIZAR_INTERCORRENCIA)) abasLocal.push('Intercorrencia')

  return abasLocal
})

const ficha = computed(() => fichaMedicaStore.getFichaMedica)

const buscarFicha = async () => {
  await fichaMedicaStore.fetchFichaMedicaPorId(id)
}

onMounted(async () => {
  loading.value = true
  await buscarFicha()
  loading.value = false
})

</script>

<style lang="scss" scoped>

.ficha-medica-id {
  padding: 20px;

  .abas-container {
    margin-bottom: 20px;
  }
}

</style>
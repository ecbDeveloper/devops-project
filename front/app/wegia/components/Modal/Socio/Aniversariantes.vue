<template>
  <Modal @fechar-modal="emit('fechar-modal')" class="modal-socio">
    <section class="tabela-socio">

      <tabela-schema
        titulo="Socios Aniversariantes"
        :isLoading="isLoading"
        :paginacao="socios"
        :linhas="socios?.items ?? []"
        :cabecalhos="[
            { nome: 'Nome', chave: 'nome', ordenavel: true },
            { nome: 'Email', chave: 'email', ordenavel: true },
            { nome: 'Telefone', chave: 'telefone', ordenavel: false },
            { nome: 'Data Aniversário', chave: 'data_nascimento', ordenavel: true },
        ]"
        @buscar="buscarSociosAniversariante"
        orderByStart="data_nascimento"
        tipoOrderByStart="asc"
      />

    </section>
  </Modal>


</template>

<script setup lang="ts">

const emit = defineEmits(['fechar-modal'])

const socioStore = useSocioStore()

const isLoading = ref(true)

const socios = computed(() => {
  const s = socioStore?.getSociosAniversariantes ?? {}

  const items = s.items?.map((item) => {
    return {
      ...item,
      nome: item.pessoa.nome,
      email: item.email,
      telefone: item.pessoa.telefone,
      data_nascimento: item.pessoa.data_nascimento
    }
  })

  return {
    ...s,
    items: items
  }
})


const buscarSociosAniversariante = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await socioStore.fetchSociosAniversariantes(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  await buscarSociosAniversariante({
    ordenacao: 'data_nascimento',
    tipoOrdenacao: 'asc'
  })

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-socio {
  .cadastrar-socio {
    height: 40px;
    width: 200px;
  }
}

</style>
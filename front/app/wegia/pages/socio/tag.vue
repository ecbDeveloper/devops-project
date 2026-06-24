<template>
  <section class="tabela-tag">
    <tabela-schema
      titulo="Tag"
      :isLoading="isLoading"
      :paginacao="tags"
      :linhas="tags?.items ?? []"
      :cabecalhos="cabecalhos"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarTags"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_TAG_SOCIO)"
          class="cadastrar-tag"
          texto="Cadastrar Tag"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-base-cadastro-texto
      v-if="abrirModal"
      placeholder="Nome da tag"
      :texto="tagEditar ? 'Editar Tag' : 'Cadastrar tag'"
      :valorExistente="tagEditar?.tag ?? ''"
      @enviar-modal="enviarTag"
      @fechar-modal="toggleAbrirModal"
    />
  </section>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_TAG_SOCIO
})

const pessoaStore = usePessoaStore()
const socioTagStore = useSocioTagStore()
const alertStore = useAlertStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const tagEditar = ref<SocioTagInterface | null>(null)
const abrirModal = ref(false)

const tags = computed(() => socioTagStore?.getTags ?? {})

const cabecalhos = computed(() => {
  const c = [
    { nome: 'Tag (grupo)', chave: 'tag', ordenavel: true }
  ]

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_TAG_SOCIO)) c.push({ nome: 'Ações', chave: 'acao', ordenavel: false })

  return c
})

const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_TAG_SOCIO)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: SocioTagInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  tagEditar.value = linha
}

const enviarTag = async (valor: string) => {

  if(!valor || valor.trim().length == 0) {
    alertStore.mostrarAlerta('error', 'O valor da tag não pode ser vazio.')
    return
  }

  try {
    if(tagEditar.value) {
      await socioTagStore.fetchAtualizarTag(tagEditar.value.id_sociotag, {
        tag: valor
      })
    } else {
      await socioTagStore.fetchCadastrarTag({
        tag: valor
      })
    }

    alertStore.mostrarAlerta('success', `Tag cadastrada com sucesso!`)
    atualizarPagina.value++
    toggleAbrirModal()
  } catch (e) {
    console.error(e)
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.tag?.some((msg : string) => msg.includes('único'))) {
      alertStore.mostrarAlerta('error', `Tag ja existe!`)
    }
  }
}

const buscarTags = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await socioTagStore.fetchTags(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const tagsLocal = socioTagStore.getTags
  if(
    !tagsLocal.items ||
    tagsLocal?.items?.length == 0
  ) await buscarTags()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-tag {
  .cadastrar-tag {
    height: 40px;
    width: 200px;
  }
}

</style>
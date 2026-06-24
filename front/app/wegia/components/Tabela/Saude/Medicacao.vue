<template>
  <section class="tabela-saude-medicacao">

    <butao
      class="aplicarTodos"
      texto="Aplicar todos"
      @click-botao="modalAplicarTodos = true"
     />

    <tabela-schema
      titulo="Comorbidades"
      :isLoading="isLoading"
      :paginacao="medicacaoPaginacao"
      :linhas="medicacoes"
      :cabecalhos="[
          { nome: 'Medicamento', chave: 'medicamento', ordenavel: true },
          { nome: 'Dosagem', chave: 'dosagem', ordenavel: true },
          { nome: 'Horario', chave: 'horario', ordenavel: true },
          { nome: 'Duracao', chave: 'duracao', ordenavel: true },
          { nome: 'Status', chave: 'status', ordenavel: true }
      ]"
      :atualizacao="atualizarPagina"
      @click-linha="toggleModalDetalhado"
      @buscar="buscarMedicacao"
    >

      <template #filtro>
        <div class="filtro-status">
          <InputSelect
              v-model="status"
              opcaoDefault="Todos Status"
              :opcoes="[
                { texto: 'Tratamento', value: 'Tratamento' },
                { texto: 'Concluído', value: 'Concluido' },
                { texto: 'Substituido', value: 'Substituido' },
                { texto: 'Cancelado', value: 'Cancelado' },
              ]"
              @select-change="atualizarPagina++"
          />
        </div>
      </template>

      <template #status="{ linha }">
        <span class="status-medicacao" :class="(linha as SaudeMedicacaoInterface).status.toLowerCase()">
          {{ (linha as SaudeMedicacaoInterface).status }}
        </span>
      </template>
    </tabela-schema>
  </section>

  <modal-saude-medicamento-detalhes
    v-if="medicacaoAberta"
    :medicacao="medicacaoAberta"
    @fechar-modal="toggleModalDetalhado"
    @buscar="atualizarPagina++"
  />

  <modal-saude-aplicar-todas-medicacoes
    v-if="modalAplicarTodos"
    :medicacoes="medicacoes"
    @fechar-modal="modalAplicarTodos = false"
    @buscar="atualizarPagina++"
  />

</template>

<script setup lang="ts">


const props = defineProps<{
  fichaId: number
}>()

const saudeMedicacaoStore = useSaudeMedicacaoStore()

const isLoading         = ref(true)
const modalAplicarTodos = ref(false)
const atualizarPagina   = ref(1)
const medicacaoAberta   = ref<SaudeMedicacaoInterface | null>(null)
const status            = ref('Tratamento')

const medicacaoPaginacao = computed(() => saudeMedicacaoStore.getMedicacao)
const medicacoes = computed(() => saudeMedicacaoStore.getMedicacao.items)

const toggleModalDetalhado = (medicacao: SaudeMedicacaoInterface | null = null) => { medicacaoAberta.value = medicacao }

const buscarMedicacao = async (params: Partial<SaudeAtendimentoBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeMedicacaoBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(status.value) paramsLocal.status = status.value

  isLoading.value = true
  await saudeMedicacaoStore.fetchMedicacao(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const atendimentos = saudeMedicacaoStore.getMedicacao
  if(
    !atendimentos.items ||
    atendimentos?.items?.length == 0 ||
    saudeMedicacaoStore.getIdFichaMedica != props.fichaId
  ) await buscarMedicacao()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-medicacao {
  .aplicarTodos {
    margin: 40px;
    width: 142px;
  }

  .cadastrar-exames {
    height: 40px;
    width: 200px;
  }
  .filtro-status {
    width: 150px;
  }

  .status-medicacao {
    display: inline-block;
    padding: 6px 12px;
    font-weight: bold;
    font-size: 0.875rem;
    border-radius: 12px;
    text-align: center;
    text-transform: capitalize;
    min-width: 110px;

    &.tratamento {
      background-color: rgba($color-primary, 0.15);
      color: $color-primary;
      border: 1px solid $color-primary;
    }

    &.concluido {
      background-color: rgba($color-success, 0.15);
      color: $color-success;
      border: 1px solid $color-success;
    }

    &.substituido {
      background-color: rgba($color-warning, 0.15);
      color: $color-warning;
      border: 1px solid $color-warning;
    }

    &.cancelado {
      background-color: rgba($color-error, 0.15);
      color: $color-error;
      border: 1px solid $color-error;
    }
  }

}

</style>
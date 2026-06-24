<template>
  <Modal class="modal-cadastrar-atendimento" @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Novo Atendimento</p>
      <BreadCrumbTimeLine
        :steps=etapas
        :currentStep="etapaAtual"
        @navigate="handleStepChange"
      />

      <Forms
        v-if="etapaAtual === 1"
        :formulario="formulario"
        @enviar-formulario="passarPrimeiraEtapa"
      />

      <div v-else-if="etapaAtual === 2">
        <Forms
          v-if="etapaAtual === 2"
          :formulario="formDois"
          @enviar-formulario="enviarMedicamento"
        >
          <template #botao>
            <Butao texto="Adicionar" classExtra="sucesso" class="botao-adicionar" @click-botao="adicionarMedicamento" />
          </template>
        </Forms>

        <section class="tabela-medicamentos">
          <tabela-schema
            titulo="Medicamentos"
            :isLoading="false"
            :paginacao="null"
            :atualizacao="0"
            :mostrarPaginacao=false
            :mostrarFiltros="false"
            :linhas="medicamentos"
            :cabecalhos="[
              { nome: 'Medicamento', chave: 'medicamento', ordenavel: false },
              { nome: 'Dosagem', chave: 'dosagem', ordenavel: false },
              { nome: 'Horário', chave: 'horario', ordenavel: false },
              { nome: 'Duração', chave: 'duracao', ordenavel: false },
              { nome: 'Ação', chave: 'acao', ordenavel: false }
            ]"
            :acao="['deletar']"
            @excluir="deletarMedicamento"
          />
        </section>
      </div>

  </Modal>

  <modal-cadastrar-saude-medico
    v-if="modalAberto"
    @fechar-modal="saudeMedicoStore.setToggleModal()"
    @buscar="buscarMedicos"
  />
</template>

<script setup lang="ts">

import { cadastrarAtendimento, enviarAtendimento } from '@/forms/Saude/CadastrarAtendimento'
import { cadastrarMedicamento } from '@/forms/Saude/CadastrarMedicamento'

const props = defineProps<{
  id_fichamedica: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const saudeMedicoStore = useSaudeMedicoStore()
const alertStore = useAlertStore()

const formulario = ref(cadastrarAtendimento)
const formDois = ref(cadastrarMedicamento)
const medicamentos = ref<SaudeMedicacaoCadastrarInterface[]>([])

const etapas = [
  { label: 'Atendimento', icon: 'fa-solid fa-stethoscope' },
  { label: 'Medicamentos', icon: 'fa-solid fa-pills' }
]
const etapaAtual = ref(1)

const modalAberto = computed(() => saudeMedicoStore.getModalAberto)

const adicionarMedicamento = () => {
  const algumPreenchido = cadastrarMedicamento.itens.some(item => item.value.trim() !== '')

  if (!algumPreenchido) {
    alertStore.mostrarAlerta('info', 'Preencha um dos campos!')
    return
  }

  const medicamento = formatFormToJson([formDois.value])

  medicamentos.value.push(medicamento)
  limparCampos([formDois.value])
}

const deletarMedicamento = (linha: any) => { medicamentos.value = medicamentos.value.filter((med: any) => med !== linha) }

const passarPrimeiraEtapa = async () => {
  const validacao  = await ValidateForm.validate([formulario.value])

  if(validacao) etapaAtual.value++
}

const enviarMedicamento = async () => {
  try {
    await enviarAtendimento(props.id_fichamedica, formulario.value, medicamentos.value)
    emit('buscar')
    emit('fechar-modal')
  } catch (e) {
    throw e
  }
}

const handleStepChange = (index: number) => {
  if(index + 1 <= etapaAtual.value) etapaAtual.value = index + 1
}

const buscarMedicos = async () => {
  await saudeMedicoStore.fetchMedicos()
}

onMounted(async () => {
  if(!saudeMedicoStore.getMedicosParaSelect?.length) await buscarMedicos()
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>

<style scoped lang="scss">

.modal-cadastrar-atendimento {

  .botao-adicionar {
    width: 120px;
  }

}

</style>
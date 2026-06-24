<template>
  <Modal @fechar-modal="emit('fechar-modal')" class="modal-cadastrar-saude-alergia" >
      <p >Cadastrar Nova Alergia</p>
      <InputSelect
        v-model="alergia"
        :erro="erro"
        :opcoes="alergias"
        :storeOpcoes="{
            store: useSaudeAlergiaStore,
            abrirModal: 'setAbrirModal',
            permissao: Permissao.CRIAR_ALERGIA
        }"
      />

      <div class="botao-div">

        <Butao
          texto="Enviar"
          @click-botao="enviar"
        />

      </div>

      <modal-cadastrar-base-cadastro-texto
        v-if="modalAberto"
        @enviar-modal="criarNovaAlergia"
        @fechar-modal="saudeAlergiaStore.setAbrirModal"
      />
  </Modal>
</template>

<script setup lang="ts">

const saudeAlergiaStore = useSaudeAlergiaStore()
const alertStore = useAlertStore()

const props = defineProps<{
  id_fichamedica: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const alergia = ref('')
const erro = ref('')

const alergias = computed(() => saudeAlergiaStore.getAlergiasParaSelect)
const modalAberto = computed(() => saudeAlergiaStore.getModalAberto)

const criarNovaAlergia = async (value: string) => {
  try {
    await saudeAlergiaStore.fetchAlergiasCadastrar({ nome: value })
    alertStore.mostrarAlerta('success', 'Alergia criada com sucesso!')
    await saudeAlergiaStore.fetchAlergias({ id_fichamedica: String(props.id_fichamedica)})
    saudeAlergiaStore.setAbrirModal()
  } catch (e: any) {
    if(e?.errors?.nome[0] == "O campo nome deve ser unico na tabela.") {
      return alertStore.mostrarAlerta('error', 'Alergia ja existe!')
    }

    return alertStore.mostrarAlerta('error', 'Erro ao criar alergia ja existe!')
  }
}

const enviar = async () => {
  erro.value = ''
  try {
    if(alergia.value === '') return erro.value = 'Campo Obrigatorio!'

    await saudeAlergiaStore.fetchFichaMedicaAlergiasCadastrar(props.id_fichamedica, Number(alergia.value))
    saudeAlergiaStore.fetchAlergias({ id_fichamedica: String(props.id_fichamedica)})
    alertStore.mostrarAlerta('success', 'Alergia cadastrada com sucesso!')
    emit('buscar')
    emit('fechar-modal')

  } catch(e) {
    console.error('Erro:', e)
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar alergia!')
    throw e
  }
}

onMounted(async () => {
  if(!saudeAlergiaStore.getAlergiasParaSelect?.length) await saudeAlergiaStore.fetchAlergias({ id_fichamedica: String(props.id_fichamedica)})
})

</script>

<style scoped lang="scss">

.modal-cadastrar-saude-alergia {


  .botao-div {
    display: flex;
    justify-content: end;

    button {
      font-weight: 700;
      height: 40px;
      text-transform: capitalize;
      width: 80px;
    }
  }
}

</style>
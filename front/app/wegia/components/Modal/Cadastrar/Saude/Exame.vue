<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Novo Exame</p>
      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />
  </Modal>

  <modal-cadastrar-base-cadastro-texto
    v-if="modalAberto"
    texto="Cadastrar novo tipo de exame"
    placeholder="Tipo de exame"
    @fechar-modal="saudeExameTipoStore.setToggleModal()"
    @enviar-modal="enviarTipo"
  />
</template>

<script setup lang="ts">

import { cadastrarExame, enviarExame } from '@/forms/Saude/CadastrarExame'

const props = defineProps<{
  id_fichamedica: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const saudeExameTipoStore = useSaudeExameTipoStore()
const alertStore = useAlertStore()

const formulario = ref(cadastrarExame)

const modalAberto = computed(() => saudeExameTipoStore.getModalAberto)

const enviarTipo = async (valor: string) => {
  const existe = saudeExameTipoStore.existeTipo(valor)

  if(existe) {
    alertStore.mostrarAlerta('info', 'Tipo de exame já cadastrado')
    return saudeExameTipoStore.setToggleModal()
  }

  try {
    await saudeExameTipoStore.fetchCriarExameTipo({ descricao: valor })
    await buscarTipos()
    alertStore.mostrarAlerta('success', 'Tipo de exame cadastrado com sucesso!')
    saudeExameTipoStore.setToggleModal()
  } catch(e) {
    console.error('Erro:', e)
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar tipo de exame!')
    throw e
  }
}

const enviar = async () => {
  try {
    const data = await enviarExame(props.id_fichamedica, formulario.value,)

    if(data?.status == 200){
      emit('buscar')
      emit('fechar-modal')
    }
  } catch(e) {
    console.error('Erro:', e)
    throw e
  }
}

const buscarTipos = async () => {
  await saudeExameTipoStore.fetchExameTipos()
}

onMounted(async () => {
  if(!saudeExameTipoStore.getTiposParaSelect?.length) await buscarTipos()
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
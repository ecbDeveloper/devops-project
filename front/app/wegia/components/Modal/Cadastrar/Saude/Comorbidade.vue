<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >{{ !comorbidade ? 'Cadastrar Nova ' : 'Atualizar ' }} Comorbidade</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviarFormulario"
      />
  </Modal>

  <ModalCadastrarSaudeCID
    v-if="modalAberto"
    @fechar-modal="saudeCidStore.setToggleModal"
    @buscar="buscarCid"
  />
</template>

<script setup lang="ts">

import { cadastrarComorbidade, enviarComorbidade, atualizarComorbidade } from '@/forms/Saude/CadastrarComorbidade'

const props = defineProps<{
  comorbidade: SaudeComorbidadeInterface | null
  id_fichamedica: number
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const saudeCidStore = useSaudeCIDStore()

const formulario = ref(cadastrarComorbidade)

const modalAberto = computed(() => saudeCidStore.getModalAberto)

const enviarFormulario = async () => {
  if(props.comorbidade) {
    await atualizar()
  } else {
    await enviar()
  }
}

const enviar = async () => {
  try {
    const data = await enviarComorbidade(props.id_fichamedica, formulario.value,)

    if(data?.status == 200){
      emit('buscar')
      emit('fechar-modal')
    }
  } catch(e) {
    console.error('Erro:', e)
    throw e
  }
}

const atualizar = async () => {
  if(!props.comorbidade) return
  try {
    const data = await atualizarComorbidade(props.id_fichamedica, formulario.value,)

    if(data?.status == 200){
      emit('buscar')
      emit('fechar-modal')
    }
  } catch(e) {
    console.error('Erro:', e)
    throw e
  }
}

const buscarCid = async () => {
  await saudeCidStore.fetchCids()
}


onMounted(async () => {
  if(!saudeCidStore.getCidsParaSelect?.length) await saudeCidStore.fetchCids()

  if(props.comorbidade){
    const comorbidadeLocal = { ...props.comorbidade }
    comorbidadeLocal.id_CID = comorbidadeLocal.cid?.id_CID ?? 0

    preencherFormulario(comorbidadeLocal, [formulario.value])
  }
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
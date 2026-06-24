<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>Cadastrar {{ titulo }}</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

  </Modal>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { cadastrarParceiro, enviarParceiro, enviarAtualizarParceiro } from '~/forms/Material/Parceiro'

const props = defineProps<{
  titulo: String,
  parceiro?: MaterialParceiroInterface | null
}>()

const alertStore = useAlertStore()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(cadastrarParceiro)

const enviar = async () => {
  try {
    let data;

    if(props.parceiro) {
      data = await enviarAtualizarParceiro(props.parceiro.id_parceiro, formulario.value)
    } else {
      data = await enviarParceiro(formulario.value)
    }

    if(data?.status == 422) return

    emit('buscar')
    emit('fechar-modal')
    alertStore.mostrarAlerta('success', `${props.titulo} cadastrado com sucesso!`)
  } catch(e) {
    console.error('Erro:', e)
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.nome?.some((msg : string) => msg.includes('único'))) alertStore.mostrarAlerta('error', `Nome ja existe!`)
    if (err.response?._data?.errors?.cnpj?.some((msg : string) => msg.includes('único'))) alertStore.mostrarAlerta('error', `CNPJ ja existe!`)
    if (err.response?._data?.errors?.cpf?.some((msg : string) => msg.includes('único'))) alertStore.mostrarAlerta('error', `CPF ja existe!`)
    if (err.response?._data?.errors?.telefone?.some((msg : string) => msg.includes('único'))) alertStore.mostrarAlerta('error', `Telefone ja existe!`)

  }
}

onMounted(() => {
  if(props.parceiro) preencherFormulario(props.parceiro, [formulario.value])
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
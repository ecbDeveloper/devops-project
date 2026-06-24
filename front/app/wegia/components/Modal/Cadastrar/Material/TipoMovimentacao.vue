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
import { cadastrarTipoMovimentacao, enviarTipoMovimentacao, enviarAtualizacaoTipoMovimentacao } from '~/forms/Material/tipoMovimentacao'
import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'

const props = defineProps<{
  titulo: String,
  tipo?: TipoMovimentacaoEnum | null,
  tipoMovimentacao?: MaterialTipoMovimentacaoInterface | null
}>()

const alertStore = useAlertStore()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(cadastrarTipoMovimentacao)

const enviar = async () => {
  try {
    let data
    let msg = `cadastrado`

    if(props.tipoMovimentacao) {
      data = await enviarAtualizacaoTipoMovimentacao(props.tipoMovimentacao.id_tipo_movimentacao, formulario.value)
      msg = 'atualizado'
    } else {
      data = await enviarTipoMovimentacao(formulario.value)
    }

    if(data?.status == 422) return

    emit('buscar')
    emit('fechar-modal')
    alertStore.mostrarAlerta('success', `${props.titulo} ${msg} com sucesso!`)
  } catch(e) {
    console.error('Erro:', e)
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.nome?.some((msg : string) => msg.includes('único'))) alertStore.mostrarAlerta('error', `Nome ja existe!`)

  }
}

onMounted(() => {

  if(props.tipoMovimentacao) {
    preencherFormulario(props.tipoMovimentacao, [formulario.value])
  }

  if(props.tipo) {
    setItemDesabilitadoPorNome(formulario.value, 'tipo', true)
    preencherFormulario({tipo: props.tipo}, [formulario.value])
  }
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
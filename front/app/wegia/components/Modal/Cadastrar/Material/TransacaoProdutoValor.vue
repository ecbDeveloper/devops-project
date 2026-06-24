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
import { atualizarTransacaoProduto, enviarAtualizarTransacaoProduto } from '~/forms/Material/TransacaoProduto'

const props = defineProps<{
  titulo: string
  transacaoProduto: MaterialTransacaoProdutoInterface
}>()

const alertStore = useAlertStore()

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(atualizarTransacaoProduto)

const enviar = async () => {
  try {

    const data = await enviarAtualizarTransacaoProduto(props.transacaoProduto.id_transacao_produto, formulario.value)

    if(data?.status == 422) return

    emit('buscar', {
      quantidade: formulario.value.itens.find(i => i.nome === 'quantidade')?.value,
      valor_unitario: formulario.value.itens.find(i => i.nome === 'valor_unitario')?.value
    })
    alertStore.mostrarAlerta('success', `${props.titulo} atualizado com sucesso!`)
  } catch(e) {
    console.error('Erro:', e)
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.nome?.some((msg : string) => msg.includes('único'))) alertStore.mostrarAlerta('error', `Nome ja existe!`)

  }
}

onMounted(() => {

  if(props.transacaoProduto) preencherFormulario(props.transacaoProduto, [formulario.value])

})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
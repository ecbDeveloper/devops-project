<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>Nova Etapa de Aceitação</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />
  </Modal>

</template>

<script setup lang="ts">

import { aceitacaoEtapa } from '~/forms/Atendido/AceitacaoEtapa'

const props = defineProps<{
  id_processo: number;
  etapa: AtendidoAceitacaoEtapaInterface | null;
}>();

const emit = defineEmits(['fechar-modal', 'buscar'])

const atendidoAceitacaoStore      = useAtendidoAceitacaoStore()
const atendidoAceitacaoEtapaStore = useAtendidoAceitacaoEtapaStore()
const alertStore                  = useAlertStore()

const formulario = ref<{ titulo: string; itens: FormularioInterface[] }>(aceitacaoEtapa)

const enviar = async () => {
  const validacao = await ValidateForm.validate([formulario.value])

  if(!validacao) return {status: 422, json: {}}

  const json = formatFormToJson([formulario.value])

  try {
    if(props.etapa) {
      await atendidoAceitacaoEtapaStore.fetchAtendidoAceitacaoEtapaEditar(props.etapa.id, json)
      alertStore.mostrarAlerta('success', 'Etapa atualizada com sucesso!')
    } else {
      await atendidoAceitacaoStore.fetchAtendidoAceitacaoEtapaCadastrar(props.id_processo, json)
      alertStore.mostrarAlerta('success', 'Etapa cadastrada com sucesso!')
    }

    emit('buscar')
    emit('fechar-modal')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar etapa!')
  }
}

onMounted(() => {
  if(props.etapa) {
    preencherFormulario(props.etapa, [formulario.value])
    mudandoCampoNoFormArray([formulario.value], 'data_fim', 'invisivel', false)
  }
})

onUnmounted(() => {
  limparCampos([formulario.value])
})

</script>
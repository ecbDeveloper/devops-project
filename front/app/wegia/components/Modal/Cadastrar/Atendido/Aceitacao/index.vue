<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p>Novo processo de Aceitação</p>

      <FormsCadastrar
        :etapaAtual="etapaAtual"
        :etapas="[
          { label: 'Documentos', icon: 'fa file-text' },
          { label: 'Dados do atendido', icon: 'fa user' }
        ]"
      >

        <Forms
          v-if="etapaAtual === 1"
          textoBotao="Próxima etapa"
          :formulario="formulario1"
          @enviar-formulario="enviarForm1"
        />

        <Forms
          v-if="etapaAtual === 2"
          :formulario="formulario2"
          @enviar-formulario="enviar"
        />
      </FormsCadastrar>


  </Modal>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { atendidoAceitacao, atendidoAceitacaoCPF } from '~/forms/Atendido/Aceitacao'

const emit = defineEmits(['fechar-modal', 'buscar'])

const contribuicaoGatewayStore = useContribuicaoGatewayStore()
const atendidoAceitacaoStore = useAtendidoAceitacaoStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const etapaAtual = ref(1)

const formulario1 = ref<{ titulo: string; itens: FormularioInterface[] }>(atendidoAceitacaoCPF)
const formulario2 = ref<{ titulo: string; itens: FormularioInterface[] }>(atendidoAceitacao)

const enviarForm1 = async () => {
  pessoaStore.setPessoaPorCpf()
  const validacao = await ValidateForm.validate([formulario1.value])

  if(!validacao) return {status: 422, json: {}}

  const json = formatFormToJson([formulario1.value])

  try {
    await pessoaStore.fetchPorCpf(json.cpf)
  } catch (e) {
    console.error('Erro:', e)
  }

  if(pessoaStore.getPessoaPorCpf) {
    mudandoCampoNoFormArray(
      [formulario2.value],
      'nome',
      'value',
      pessoaStore.getPessoaPorCpf.nome
    )

    mudandoCampoNoFormArray(
      [formulario2.value],
      'nome',
      'desabilitado',
      true
    )

    mudandoCampoNoFormArray(
      [formulario2.value],
      'sobrenome',
      'value',
      pessoaStore.getPessoaPorCpf.sobrenome
    )

    mudandoCampoNoFormArray(
      [formulario2.value],
      'sobrenome',
      'desabilitado',
      true
    )

    alertStore.mostrarAlerta('info', `Pessoa encontrada, deseja cadastrar?`)
  }

  mudandoCampoNoFormArray(
    [formulario2.value],
    'cpf',
    'value',
    FormatarParaForm.formatarCpf(json.cpf)
  )

  etapaAtual.value++
}

const enviar = async () => {
  try {

    const validacao = await ValidateForm.validate([formulario2.value])

    if(!validacao) return {status: 422, json: {}}

    const json = formatFormToJson([formulario2.value])

    if(!pessoaStore.getPessoaPorCpf) {
      await atendidoAceitacaoStore.fetchAtendidoAceitacaoCadastrar(json)
    } else {
      await atendidoAceitacaoStore.fetchAtendidoAceitacaoCadastrarComPessoa(pessoaStore.getPessoaPorCpf.id_pessoa)
    }

    emit('buscar')
    emit('fechar-modal')
  } catch(e) {
    const err = e as FetchError<ErroApiInterface>

    if (err.response?._data?.errors?.cpf?.some((msg : string) => msg.includes('unico'))) {
      alertStore.mostrarAlerta('error', `Pedido de aceitação já existe!`)
    }
  }
}

onMounted( async () => {
  if(!contribuicaoGatewayStore.getGatewaysFiltros.length) await contribuicaoGatewayStore.fetchGatewaysFiltro()
})

onUnmounted(() => {
  limparCampos([formulario1.value])
  limparCampos([formulario2.value])
})

</script>
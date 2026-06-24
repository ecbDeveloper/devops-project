<template>
  <Modal @fechar-modal="emit('fechar-modal')" class="modal-medicacoes">
    <div >
      <h3 class="titulo">Confirme as medicações aplicadas!</h3>

      <tabela-schema
        titulo="Medicações"
        :linhas="medicacaoLocal"
        :mostrarFiltros="false"
        :mostrarTextoPaginacao="false"
        :mostrarPaginacao="false"
        :cabecalhos="[
            { nome: 'Medicamento', chave: 'medicamento', ordenavel: false },
            { nome: 'Dosagem', chave: 'dosagem', ordenavel: false },
            { nome: 'Ações', chave: 'acao', ordenavel: false },
        ]"
        :acao="['deletar']"
        @excluir="deletarMedicacao"
      />
    </div>

    <div class="botao-acao">
      <butao
        class="reiniciar-aplicacao"
        texto="Reiniciar aplicação"
        @click-botao="medicacaoLocal = medicacoes"
      />

      <butao
        class="salvar-aplicacao"
        texto="Salvar aplicação"
        @click-botao="salvarAplicacao"
      />
    </div>

  </Modal>
</template>

<script setup lang="ts">

  const saudeMedicacaoStore = useSaudeMedicacaoStore()
  const pessoaStore         = usePessoaStore()
  const alertStore                        = useAlertStore()

  const props = defineProps<{
    medicacoes: SaudeMedicacaoInterface[]
  }>()

  const emit = defineEmits(['fechar-modal', 'buscar'])

  const medicacaoLocal = ref(props.medicacoes ?? [])

  const deletarMedicacao = (linha: SaudeMedicacaoInterface) => {
    medicacaoLocal.value = medicacaoLocal.value.filter(
      medicacao => medicacao.id_medicacao !== linha.id_medicacao
    )
  }

  const salvarAplicacao = async () => {

    if(!pessoaStore?.getPessoa?.funcionario?.id_funcionario) return

    const ids = medicacaoLocal.value.map(
      (medicacao: SaudeMedicacaoInterface) => Number(medicacao.id_medicacao)
    )

    const hoje = new Date()
      .toISOString()
      .slice(0, 10)

    const body = {
      id_funcionario: pessoaStore.getPessoa.funcionario.id_funcionario,
      aplicacao: hoje,
      medicacao: ids
    }

    try {
      await saudeMedicacaoStore.fetchCadastrarAdministracaoEmMassa(body)
      emit('buscar')
      emit('fechar-modal')
      alertStore.mostrarAlerta('success', 'Medicamentos aplicados com sucesso!')
    } catch {
      alertStore.mostrarAlerta('success', 'Erro ao aplicar medicamentos!')
    }

  }


</script>

<style lang="scss">

.modal-medicacoes > .modal  {

  height: 95%;
  width: 95%;

  @include xl {
    width: 1024px;
  }
}

.modal-medicacoes {

  .botao-acao {
    display: flex;
    gap: 16px;
    justify-content: end;

    button {
      margin-right: 0px;
      width: 164px;
    }

    .reiniciar-aplicacao {
      background-color: $color-quinary;
    }
  }
}

</style>
  <template>

    <modal @fechar-modal="emit('fechar-modal')" class="modal-detalhe-transacao">

      <div v-if="!isLoading">
        <p><strong>Almoxarifado:</strong>  {{ transacaoLocal.almoxarifado.descricao }}</p>
        <p><strong>Origem:</strong> {{ transacaoLocal.parceiro.nome }}</p>
        <p><strong>Tipo:</strong>  {{ transacaoLocal.tipo_movimentacao.nome }}</p>
        <p><strong>Responsável:</strong>  {{ transacaoLocal.responsavel.nome }}</p>
        <p><strong>Valor Total:</strong>  R$ {{ valorTotal.toFixed(2).replace('.', ',') }}</p>
        <p><strong>Data:</strong>  {{ transacaoLocal.data }}</p>

        <tabela
          class="tabela"
          :cabecalhos="[
            { nome: 'Produto', chave: 'descricao_produto', ordenavel: false },
            { nome: 'Quantidade', chave: 'quantidade', ordenavel: false },
            { nome: 'Valor Unitario', chave: 'valor_unitario', ordenavel: false },
            { nome: 'Unidade', chave: 'descricao_unidade', ordenavel: false },
            { nome: 'Valor Total', chave: 'valor_total', ordenavel: false },
            { nome: 'Acoes', chave: 'acao', ordenavel: false },
          ]"
          :acao="acoes"
          :linhas="linhas"
          @excluir="excluir"
          @editar="toggleModal"
        />
      </div>

      <loading v-else />

    </modal>

    <modal-cadastrar-material-transacao-produto-valor
      v-if="transacaoProdutoEditar"
      titulo="Atualizar valores do produto"
      :transacaoProduto="transacaoProdutoEditar"
      @fechar-modal="toggleModal"
      @buscar="atualizarTransacaoLocal"
    />

  </template>

<script setup lang="ts">

  const props = defineProps<{
    transacao: MaterialTransacaoInterface,
    isLoading: Boolean
  }>()

  const emit = defineEmits(['fechar-modal', 'buscar'])

  const materialTransacaoProdutoStore = useMaterialTransacaoProdutoStore()
  const alertStore = useAlertStore()
  const pessoaStore = usePessoaStore()

  const transacaoLocal = ref(props.transacao)
  const transacaoProdutoEditar = ref<MaterialTransacaoProdutoInterface | null>(null)

  const acoes = computed(() => {
    const a = []

    if(props.transacao.tipo_movimentacao.tipo === TipoMovimentacaoEnum.ENTRADA) {
      if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_ENTRADA_PRODUTO)) a.push('editar')
      if(pessoaStore.possuiPermissao(Permissao.DELETAR_MATERIAL_ENTRADA_PRODUTO)) a.push('deletar')
    } else if (props.transacao.tipo_movimentacao.tipo === TipoMovimentacaoEnum.SAIDA) {
      if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_ENTRADA_SAIDA)) a.push('editar')
      if(pessoaStore.possuiPermissao(Permissao.DELETAR_MATERIAL_ENTRADA_SAIDA)) a.push('deletar')
    }


    return a
  })

  const valorTotal = computed(() => {
    return transacaoLocal.value.transacao_produto
      .reduce((total: number, item: {valor_unitario: string, quantidade: number}) => {
        return total + (item.quantidade * Number(item.valor_unitario))
      }, 0)
  })

  const linhas = computed(() => {
    return transacaoLocal.value.transacao_produto.map(t => {
      return {
        ...t,
        descricao_produto: t.produto.descricao,
        descricao_unidade: t.produto.unidade.descricao,
        valor_total: `R$ ${(Number(t.quantidade) * Number(t.valor_unitario)).toFixed(2)}`

      }
    })
  })

  const toggleModal = (produto: MaterialTransacaoProdutoInterface | null = null) => { transacaoProdutoEditar.value = produto }

  const excluir = async (linhas: MaterialTransacaoProdutoInterface) => {
    try {
      await materialTransacaoProdutoStore.fetchExcluirTransacaoProduto(linhas.id_transacao_produto)
      transacaoLocal.value.transacao_produto = transacaoLocal.value.transacao_produto.filter(
        (item) => item.id_transacao_produto !== linhas.id_transacao_produto
      )
      alertStore.mostrarAlerta('success', 'Produto excluido da lista com sucesso!')
      emit('buscar')
    } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao excluir produto da lista!')
    }
  }

  const atualizarTransacaoLocal = (atualizar: { quantidade: number, valor_unitario: string} | null) => {
    if (!atualizar || !transacaoProdutoEditar.value?.id_transacao_produto) return

    const produto = transacaoLocal.value.transacao_produto.find(
      (p) => p.id_transacao_produto === transacaoProdutoEditar.value!.id_transacao_produto
    )

    if (produto) {
      if (atualizar.quantidade !== undefined) {
        produto.quantidade = atualizar.quantidade
      }

      if (atualizar.valor_unitario !== undefined) {
        produto.valor_unitario = atualizar.valor_unitario.replace(',', '.')
      }
    }

    toggleModal()
  }

  </script>

  <style lang="scss">

  .modal-detalhe-transacao {
    &>.modal {
      height: calc(100% - 48px);
      width: calc(100% - 48px);

      p {
        margin-bottom: 8px;
        margin-left: 16px;
      }

      .tabela {
        margin-top: 24px;
      }
    }

  }

  </style>
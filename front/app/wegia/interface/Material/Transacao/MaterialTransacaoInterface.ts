export interface MaterialTransacaoInterface {
  id_transacao: number
  id_tipo_movimentacao: number
  id_almoxarifado: number
  id_responsavel: number
  id_parceiro: number
  data: string
  valor_unitario: string
  quantidade: number
  parceiro: MaterialParceiroInterface
  tipo_movimentacao: MaterialTipoMovimentacaoInterface
  almoxarifado: MaterialAlmoxarifadoInterface
  responsavel: PessoaInterface
  transacao_produto: MaterialTransacaoProdutoInterface[]
}
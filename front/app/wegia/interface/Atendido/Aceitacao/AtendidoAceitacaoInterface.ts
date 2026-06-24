export interface AtendidoAceitacaoInterface {
  id: number
  data_inicio: string
  data_fim: string
  descricao: string
  id_status: number
  id_pessoa: number
  pessoa: PessoaInterface
  arquivos: AtendidoAceitacaoArquivoInterface[]
  status: AtendidoAceitacaoStatusInterface
  etapas: AtendidoAceitacaoEtapaInterface[] | null
}
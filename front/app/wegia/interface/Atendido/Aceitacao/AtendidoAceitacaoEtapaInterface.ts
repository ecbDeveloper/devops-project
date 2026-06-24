export interface AtendidoAceitacaoEtapaInterface {
  id: number
  data_inicio: string
  data_fim: string
  descricao: string
  id_status: number
  id_processo: number
  status: AtendidoAceitacaoStatusInterface
  arquivos: AtendidoAceitacaoEtapaArquivoInterface[]
}
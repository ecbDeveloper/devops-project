export interface ConfiguracaoCampoImagemInterface {
  id_campo: number
  nome_campo: string
  tipo: string
  imagens: ConfiguracaoImagemInterface[] | null
}
export interface PessoaArquivoInterface {
  id_pessoa_arquivo: number;
  id_pessoa: number;
  id_pessoa_tipo_arquivo: number;
  data: string;
  extensao_arquivo: string;
  nome_arquivo: string;
  arquivo: string;
  tipo: PessoaTipoArquivoInterface | null;
}
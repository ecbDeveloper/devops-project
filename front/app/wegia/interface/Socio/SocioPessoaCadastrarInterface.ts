export interface SocioPessoaCadastrarInterface {
  id_sociostatus: number;
  id_sociotipo: number;
  id_sociotag?: number | null;

  email?: string | null;
  valor_periodo?: number | null;
  data_referencia?: string | null;

  nome: string;
  cpf: string;
  telefone: string;
  data_nascimento?: string;

  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero_endereco?: string;
  complemento?: string;
  ibge?: string;
}

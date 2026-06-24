export interface SocioPublicoInterface {
  id_pessoa: number
  id_socio: number | null
  cpf: string
  nome: string
  telefone: string
  data_nascimento: string
  email: string | null
  cep: string | null
  estado: string | null
  cidade: string | null
  bairro: string | null
  numero_endereco: string | null
  complemento: string | null
  ibge: string | null
}
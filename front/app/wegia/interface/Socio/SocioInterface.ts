export interface SocioInterface {
  id_socio: number
  id_pessoa: number
  id_sociostatus: number
  id_sociotipo: number
  id_sociotag: number
  email: string
  valor_periodo: string
  data_referencia: string
  pessoa: PessoaInterface

  status: SocioStatusInterface
  tipo: SocioTipoInterface
  tag: SocioTagInterface
}
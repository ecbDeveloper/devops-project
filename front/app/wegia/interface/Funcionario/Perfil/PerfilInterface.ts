export interface PerfilInterface {
  id_perfil: number
  cargo: string
  nome: string,
  permissoes: PermissaoInterface[] | null
}
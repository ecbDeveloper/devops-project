export interface MaterialProdutoInterface {
  id_produto: number
  id_categoria: number
  id_unidade: number
  descricao: string
  codigo: string
  oculto: number
  unidade: MaterialUnidadeInterface
  categoria: MaterialCategoriaInterface
}
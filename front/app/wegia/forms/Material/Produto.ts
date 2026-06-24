import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const cadastrarProduto = {
  titulo: '',
  itens: [
      {
        nome: 'descricao',
        label: "nome do produto",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'codigo',
        label: "Código",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_categoria',
        label: "Categoria",
        type: 'select',
        storeOpcoes: {
          store: useMaterialCategoriaStore,
          stateProp: 'getCategoriasParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_CATEGORIA
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_unidade',
        label: "Unidade",
        type: 'select',
        storeOpcoes: {
          store: useMaterialUnidadeStore,
          stateProp: 'getUnidadesParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_UNIDADE
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      }
  ]
}

export const atualizarProduto = {
  titulo: '',
  itens: [
      {
        nome: 'descricao',
        label: "nome do produto",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'codigo',
        label: "Código",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_categoria',
        label: "Categoria",
        type: 'select',
        storeOpcoes: {
          store: useMaterialCategoriaStore,
          stateProp: 'getCategoriasParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_CATEGORIA
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_unidade',
        label: "Unidade",
        type: 'select',
        storeOpcoes: {
          store: useMaterialUnidadeStore,
          stateProp: 'getUnidadesParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_UNIDADE
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'oculto',
        label: "Ocultar do relatorio?",
        type: 'select',
        opcoes: [
          { texto: 'Sim', value: 1 },
          { texto: 'Não', value: 0 },
        ],
        value: '',
        erro: '',
      }
  ]
}

export const enviarProduto = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const materialProdutoStore = useMaterialProdutoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const formData = formatFormToJson([formulario])

  try {
    await materialProdutoStore.fetchCadastrarProduto(formData)

  } catch (e) {
    throw e as FetchError<ErroApiInterface>
  }
}

export const enviarAtualizacaoProduto = async (id: number, formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const materialProdutoStore = useMaterialProdutoStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) return {status: 422, json: {}}

  const formData = formatFormToJson([formulario])

  try {
    await materialProdutoStore.fetchAtualizarProduto(id, formData)

  } catch (e) {
    throw e as FetchError<ErroApiInterface>
  }
}
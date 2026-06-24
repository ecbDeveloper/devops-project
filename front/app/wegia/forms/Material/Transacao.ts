import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const cadastrarTransacao = {
  titulo: '',
  itens: [
      {
        nome: 'id_parceiro',
        label: "Origem",
        type: 'select',
        storeOpcoes: {
          store: useMaterialParceiroStore,
          stateProp: 'getParceiroParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_ORIGEM_SAIDA
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_almoxarifado',
        label: "Almoxarifado",
        type: 'select',
        storeOpcoes: {
          store: useMaterialAlmoxarifadoStore,
          stateProp: 'getAlmoxarifadoParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_ALMOXARIFADO
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_tipo_movimentacao',
        label: "Tipo",
        type: 'select',
        storeOpcoes: {
          store: useMaterialTipoMovimentacaoStore,
          stateProp: 'getTipoMovimentacaoParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_TIPO_MOVIMENTACAO
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      }
  ]
}

export const cadastrarTransacaoProduto = {
  titulo: '',
  itens: [
      {
        nome: 'id_produto',
        label: "Produto",
        type: 'select',
        storeOpcoes: {
          store: useMaterialProdutoStore,
          stateProp: 'getProdutoParaFiltrosParaSelect',
          abrirModal: 'setAbrirModal',
          permissao: Permissao.CRIAR_MATERIAL_PRODUTO
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'quantidade',
        label: "Quantidade",
        type: 'text',
        value: '',
        erro: '',
        regex: /[^0-9]/g,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'valor_unitario',
        label: "Valor Unitário",
        placeholder: '12,90',
        type: 'text',
        value: '',
        erro: '',
        regex: /[^0-9,]/g,
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
          abrirModal: 'setAbrirModal'
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
          abrirModal: 'setAbrirModal'
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

export const enviarTransacoes = async (
  formularioOrigem: { titulo: string; itens: FormularioInterface[] },
  produtosAdicionados: any[]
) => {
  const alertStore = useAlertStore()
  const materialTransacaoStore = useMaterialTransacaoStore()

  const valido = await ValidateForm.validate([formularioOrigem])
  if (!valido) return { status: 422, json: {} }

  if (!produtosAdicionados.length) {
    alertStore.mostrarAlerta("error", "Adicione ao menos um produto!")
    return { status: 422, json: {} }
  }

  const formData = formatFormToJson([formularioOrigem])

  const produtos = produtosAdicionados.map((produto) => ({
    id_produto: produto.id_produto,
    quantidade: Number(produto.quantidade),
    valor_unitario: Number.parseFloat(produto.valor_unitario.replace(",", ".")),
  }))

  const payload = {
    id_parceiro: formData.id_parceiro,
    id_almoxarifado: formData.id_almoxarifado,
    id_tipo_movimentacao: formData.id_tipo_movimentacao,
    produtos: produtos,
  }

  try {

    await materialTransacaoStore.fetchCadastrarTransacao(payload)

    alertStore.mostrarAlerta("success", "Transações cadastradas com sucesso!")

    produtosAdicionados.splice(0, produtosAdicionados.length)
    limparCampos([formularioOrigem])

    return { status: 200 }
  } catch (e) {
    const error = e as FetchError<any>
    console.error("Erro ao enviar transações:", error)
    alertStore.mostrarAlerta("error", "Erro ao cadastrar produtos!")
    throw error
  }
}
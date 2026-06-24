
export const cadastrarComorbidade = {
  titulo: '',
  itens: [
      {
        nome: 'id_CID',
        label: "Enfermidade (CID)",
        type: 'select',
        storeOpcoes: {
            store: useSaudeCIDStore,
            stateProp: 'getCidsParaSelect',
            abrirModal: 'setToggleModal',
            permissao: Permissao.CRIAR_CID
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
     },
      {
          nome: 'data_diagnostico',
          label: "Data do Diagnóstico",
          placeholder: 'DD/mm/aaaa',
          type: 'text',
          value: '',
          erro: '',
          regex: /\D/g,
          mask: '##/##/####',
          formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
          validacao: ValidateForm.dataMenorQueHoje,
          bloqueado: false
      },
      {
          nome: 'status',
          label: 'Status',
          type: 'select',
          opcoes: [
              { texto: 'Ativo', value: 1 },
              { texto: 'Inativo', value: 0 },
          ],
          value: 1,
          erro: '',
          bloqueado: false,
      }
  ]
}

export const atualizarComorbidade = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeComorbidadeStore = useSaudeComorbidadeStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario]) as SaudeComorbidadeCadastrarInterface

  try {
      await saudeComorbidadeStore.fetchComorbidadeAtualizar(id, json)
      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Comorbidade atualizado com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao atualizar comorbidade!')
      throw e
  }

}

export const enviarComorbidade = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeComorbidadeStore = useSaudeComorbidadeStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario]) as SaudeComorbidadeCadastrarInterface

  try {
      await saudeComorbidadeStore.fetchComorbidadeCadastrar(id, json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Comorbidade cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar ficha medica!')
      throw e
  }

}
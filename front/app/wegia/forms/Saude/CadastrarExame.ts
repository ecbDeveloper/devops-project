
export const cadastrarExame = {
  titulo: '',
  itens: [
      {
        nome: 'arquivo',
        label: "Exame",
        type: 'file',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        tiposAceitos: 'png|jpg|jpeg',
        tamanho: 5 * 1024 * 1024,
        obrigatorio: true
      },
      {
          nome: 'data',
          label: "Data do Exame",
          placeholder: 'DD/mm/aaaa',
          type: 'text',
          value: '',
          erro: '',
          regex: /\D/g,
          mask: '##/##/####',
          formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
          validacao: ValidateForm.dataMenorQueHoje,
          obrigatorio: true,
          bloqueado: false
      },
      {
          nome: 'id_exame_tipo',
          label: 'Tipo de exame',
          type: 'select',
          storeOpcoes: {
              store: useSaudeExameTipoStore,
              stateProp: 'getTiposParaSelect',
              abrirModal: 'setToggleModal',
              permissao: Permissao.CRIAR_TIPO_EXAME
          },
          value: '',
          erro: '',
          validacao: ValidateForm.obrigatorio,
          obrigatorio: true,
          bloqueado: false,
      }
  ]
}

export const enviarExame = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeExameStore = useSaudeExameStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = criarFormData([formulario])

  try {
      await saudeExameStore.fetchExameCadastrar(id, json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Exame cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar exame!')
      throw e
  }

}
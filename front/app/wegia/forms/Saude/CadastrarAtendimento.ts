
export const cadastrarAtendimento = {
  titulo: '',
  itens: [
      {
        nome: 'id_medico',
        label: 'Medico',
        type: 'select',
        storeOpcoes: {
            store: useSaudeMedicoStore,
            stateProp: 'getMedicosParaSelect',
            abrirModal: 'setToggleModal',
            permissao: Permissao.CRIAR_MEDICO
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
        bloqueado: false,
      },
      {
        nome: 'data_atendimento',
        label: "Data do Atendimento",
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
        nome: 'descricao',
        label: "Descricao",
        type: 'textarea',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
        bloqueado: false
      },
  ]
}

export const enviarAtendimento = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
  medicacoes: SaudeMedicacaoCadastrarInterface[] | null
) => {

  const saudeAtendimentoStore = useSaudeAtendimentoStore()
  const pessoaStore = usePessoaStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  if(!pessoaStore.getPessoa?.funcionario) {
    return alertStore.mostrarAlerta('error', 'Voce precisar ser um funcionario para cadastrar!')
  }

  const json = formatFormToJson([formulario])
  json.id_funcionario = pessoaStore.getPessoa.funcionario.id_funcionario
  if(medicacoes) json.medicacoes = medicacoes

  try {
      await saudeAtendimentoStore.fetchAtendimentoCadastrar(id, json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Exame cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar exame!')
      throw e
  }

}
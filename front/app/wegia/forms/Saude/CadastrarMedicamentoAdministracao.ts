
export const cadastrarMedicamentoAdministracao = {
  titulo: '',
  itens: [
      {
          nome: 'aplicacao',
          label: "Data da aplicação",
          placeholder: 'DD/mm/aaaa hh:mm',
          type: 'text',
          value: '',
          erro: '',
          regex: /\D/g,
          mask: '##/##/#### ##:##',
          formatarParaEnviar: [
            /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
            '$3-$2-$1 $4:$5:00'
          ],
          validacao: ValidateForm.dataMenorQueHojeComHorario,
          obrigatorio: true,
          bloqueado: false
      },
  ]
}

export const enviarMedicamentoAdministracao = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeMedicacaoStore = useSaudeMedicacaoStore()
  const pessoaStore = usePessoaStore()
  const alertStore = useAlertStore()

  if(!pessoaStore.getPessoa?.funcionario) alertStore.mostrarAlerta('error', 'Voce não é um usuário válido!')

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario]) as SaudeMedicacaoAdministracaoCadastrarInterface
  if(pessoaStore.getPessoa?.funcionario) json.funcionario_id_funcionario = pessoaStore.getPessoa?.funcionario?.id_funcionario

  try {
      await saudeMedicacaoStore.fetchCadastrarAdministracao(id, json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Exame cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar exame!')
      throw e
  }

}
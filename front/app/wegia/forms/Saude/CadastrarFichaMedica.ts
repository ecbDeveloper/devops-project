
export const cadastrarFichaMedica = {
  titulo: '',
  itens: [
      {
          nome: 'id_pessoa',
          label: "Nome da pessoa",
          type: 'autoComplete',
          storeOpcoes: {
              store: usePessoaStore,
              stateProp: 'getPessoaParaFiltro'
          },
          value: '',
          erro: '',
          validacao: ValidateForm.obrigatorio,
          obrigatorio: true
      },
      {
          nome: 'prontuario',
          label: "Prontuário",
          type: 'textarea',
          value: '',
          erro: '',
          validacao: ValidateForm.obrigatorio,
          obrigatorio: true
      }
  ]
}

export const atualizarAdotante = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
  id: number,
) => {
  const petStore = usePetStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario]) as AdocaoCadastrarInterface

  try {
      await petStore.fetchAtualizarAdocao(id, json)
      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Adotante atualizado com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao atualizar adotante!')
      throw e
  }

}

export const enviarFichaMedica = async (
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const fichaMedicaStore = useSaudeFichaMedicaStore()
  const alertStore = useAlertStore()

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario]) as SaudeFichaMedicaCadastrarInterface

  try {
      await fichaMedicaStore.fetchFichaMedicaCadastrar(json)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Ficha Medica cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar ficha medica!')
      throw e
  }

}
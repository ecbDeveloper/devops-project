import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const ContatoDaInstituicao = {
        titulo: 'Contato da instituição',
        itens: [
            {
                nome: 'descricao',
                label: "Descrição do contato",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'contato',
                label: "Contato",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            }
        ]
}

export const enviarContato = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

    const configuracaoContatoInstituicaoStore = useConfiguracaoContatoInstituicaoStore()
    const alertStore = useAlertStore()
    const validacao = await ValidateForm.validate([formulario])

    if(!validacao) throw new Error('Formulário inválido')

    const json = formatFormToJson([formulario])

    await configuracaoContatoInstituicaoStore.fetchCadastrarContato(json).then(() => {
        alertStore.mostrarAlerta('success', 'Informações de contato cadastradas com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao cadastrar contato!')
    })
}

export const atualizarContato = async (id_contato: number, formulario: { titulo: string; itens: FormularioInterface[] }) => {

  const configuracaoContatoInstituicaoStore = useConfiguracaoContatoInstituicaoStore()
  const alertStore = useAlertStore()
  const validacao = await ValidateForm.validate([formulario])

  if(!validacao) throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario])

  await configuracaoContatoInstituicaoStore.fetchAtualizarContato(id_contato, json).then(() => {
      alertStore.mostrarAlerta('success', 'Informações de contato atualizadas com sucesso')
  }).catch(e => {
      console.log(e)
      alertStore.mostrarAlerta('error', 'Erro ao atualizar contato!')
  })
}
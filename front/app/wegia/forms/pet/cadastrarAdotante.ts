
export const cadastrarAdotante = {
    titulo: '',
    itens: [
        {
            nome: 'id_pessoa',
            label: "Nome do adotante",
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
            nome: 'data_adocao',
            label: "Data Adoção",
            placeholder: 'DD/mm/aaaa',
            type: 'text',
            value: '',
            erro: '',
            regex: /\D/g,
            mask: '##/##/####',
            formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
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

export const enviarCadastroAdotante = async (
    formulario: { titulo: string; itens: FormularioInterface[] },
    id: number,
) => {
    const petStore = usePetStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])

    if(!validacao)  throw new Error('Formulário inválido')

    const json = formatFormToJson([formulario]) as AdocaoCadastrarInterface

    try {
        await petStore.fetchCriarAdocao(id, json)
        limparCampos([formulario])

        alertStore.mostrarAlerta('success', 'Adotante cadastrado com sucesso!')
        return {status: 200, json}
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao cadastrar adotante!')
        throw e
    }

}
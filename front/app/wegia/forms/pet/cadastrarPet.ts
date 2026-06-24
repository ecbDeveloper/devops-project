export const cadastrarPet = {
        titulo: 'Cadastrar Pet',
        itens: [
            {
                nome: 'nome',
                label: "Nome",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'cor',
                label: "Cor",
                type: 'select',
                storeOpcoes: {
                    store: usePetStore,
                    stateProp: 'getCorParaSelect'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'id_pet_especie',
                label: "Espécie",
                type: 'select',
                storeOpcoes: {
                    store: useEspecieStore,
                    action: 'fetchEspecies',
                    stateProp: 'getEspeciesParaSelect',
                    abrirModal: 'setToggleModal'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'id_pet_raca',
                label: "Raça",
                type: 'select',
                storeOpcoes: {
                    store: useRacaStore,
                    action: 'fetchRacas',
                    stateProp: 'getRacasParaSelect',
                    abrirModal: 'setToggleModal'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'sexo',
                label: "Sexo",
                type: 'radio',
                value: '',
                erro: '',
                opcoes: [
                    { value: 'M', icon: 'fas fa-mars' },
                    { value: 'F', icon: 'fas fa-venus' }
                ],
                validacao: ValidateForm.obrigatorio,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'data_nascimento',
                label: "Nascimento (aproximado)",
                placeholder: 'DD/mm/aaaa',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: Mascara.data,
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                validacao: ValidateForm.dataMenorQueHoje,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'data_acolhimento',
                label: "Data de Acolhimento",
                placeholder: 'DD/mm/aaaa',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: Mascara.data,
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                validacao: ValidateForm.dataMenorQueHoje,
                bloqueado: false,
                obrigatorio: true
            },
            {
                nome: 'caracteristicas_especificas',
                label: "Características",
                type: 'textarea',
                value: '',
                erro: '',
                bloqueado: false,
                obrigatorio: false
            }
        ]
}


export const enviarCadastroPet = async (
    formulario: { titulo: string; itens: FormularioInterface[] },
    foto: {value: File | null, erro: string, mimeType: string}
) => {

    const petStore = usePetStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])
    if(foto?.value) {
        foto.erro = ValidateForm.arquivoValidacao(foto.value, foto.mimeType, false)
    }

    if(!validacao || foto.erro !== "") return {status: 422, json: {}}

    const formData = criarFormData([formulario])
    const data     = formatFormToJson([formulario])

    const nascimento  = FormatString.parseDataUS(data.data_nascimento)
    const acolhimento = FormatString.parseDataUS(data.data_acolhimento)

    if (nascimento && acolhimento && acolhimento < nascimento) {
        mudandoCampoNoFormArray([formulario], 'data_acolhimento', 'erro', 'A data de acolhimento deve ser posterior à data de nascimento.')
        return { status: 422, json: {} }
    }

    if(foto?.value) {
        formData.append('foto', foto.value)
    }

    try {
        await petStore.fetchCriarPet(formData)
        limparCampos([formulario])
        foto.value = null

        alertStore.mostrarAlerta('success', 'Pet cadastrado com sucesso!')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao cadastrar o pet!')
        throw e
    }
}

export const atualizarPet = async (
    id: number,
    formulario: { titulo: string; itens: FormularioInterface[] },
    foto: {value: File | null, erro: string, mimeType: string}
) => {

    const petStore = usePetStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])

    if(foto?.value && typeof foto.value !== 'string') {
        foto.erro = ValidateForm.arquivoValidacao(foto.value, foto.mimeType, false)
    }

    if(!validacao || foto.erro !== "") return {status: 422, json: {}}

    const formData = criarFormData([formulario])
    const data     = formatFormToJson([formulario])

    const nascimento  = FormatString.parseDataUS(data.data_nascimento)
    const acolhimento = FormatString.parseDataUS(data.data_acolhimento)

    if (nascimento && acolhimento && acolhimento < nascimento) {
        mudandoCampoNoFormArray([formulario], 'data_acolhimento', 'erro', 'A data de acolhimento deve ser posterior à data de nascimento.')
        return { status: 422, json: {} }
    }

    if(foto?.value && typeof foto.value !== 'string') {
        formData.append('foto', foto.value)
    }

    try {
        await petStore.fetchAtualizarPet(formData, id)

        alertStore.mostrarAlerta('success', 'Pet atualizado com sucesso!')
    } catch (e) {
        alertStore.mostrarAlerta('error', 'Erro ao atualizar o pet!')
        throw e
    }
}
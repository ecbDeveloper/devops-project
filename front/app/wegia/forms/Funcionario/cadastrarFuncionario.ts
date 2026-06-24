import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const cadastrarFuncionarioCpf = [
    {
        titulo: '',
        itens: [
            {
                nome: 'cpf',
                label: "CPF",
                type: 'text',
                placeholder: "Ex. 000.000.000-00",
                mask: "###.###.###-##",
                value: '',
                erro: '',
                regex: /\D/g,
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCpf,
                validacao: ValidateForm.cpfValidacao,
                obrigatorio: true
            }
        ]
    }

];

export const cadastrarFuncionario = [
    {
        titulo: 'Informações Pessoais',
        itens: [
            {
                nome: 'nome',
                label: "Nome",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'sobrenome',
                label: "Sobrenome",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'sexo',
                label: "Sexo",
                type: 'radio',
                value: '',
                erro: '',
                opcoes: [
                    { value: 'm', icon: 'fas fa-mars' },
                    { value: 'f', icon: 'fas fa-venus' }
                ],
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'telefone',
                label: "Telefone",
                placeholder: 'Ex: (22) 99999-9999',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: '(##) #####-####',
                validacao: ValidateForm.obrigatorio,
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarTelefone,
                obrigatorio: true
            },
            {
                nome: 'data_nascimento',
                label: "Nascimento",
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
    },
    {
        titulo: 'Documentação',
        itens: [
            {
                nome: 'registro_geral',
                label: "Numero do RG",
                type: 'text',
                placeholder: 'Ex: 22.222.222-2',
                mask: '##.###.###-#',
                regex: /\D/g,
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarRg,
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'orgao_emissor',
                label: "Órgão Emissor",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'data_expedicao',
                label: "Data de expedição",
                placeholder: 'DD/mm/aaaa',
                mask: '##/##/####',
                regex: /\D/g,
                type: 'text',
                value: '',
                erro: '',
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                validacao: ValidateForm.dataMenorQueHoje,
                obrigatorio: true
            },
            {
                nome: 'cpf',
                label: "Número do CPF",
                placeholder: "Ex. 000.000.000-00",
                mask: "###.###.###-##",
                regex: /\D/g,
                type: 'text',
                value: '',
                erro: '',
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCpf,
                validacao: ValidateForm.cpfValidacao,
                obrigatorio: true
            },
            {
                nome: 'data_admissao',
                label: "Data de Admissão",
                placeholder: 'DD/mm/aaaa',
                mask: '##/##/####',
                regex: /\D/g,
                type: 'text',
                value: '',
                erro: '',
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                validacao: ValidateForm.dataMenorQueHoje,
                obrigatorio: true
            },
            {
                nome: 'id_situacao',
                label: "Situação",
                type: 'select',
                storeOpcoes: {
                    store: useSituacaoStore,
                    action: 'fetchSituacao',
                    stateProp: 'getSituacaoParaSelect',
                    abrirModal: 'setModalAberto'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'id_perfil',
                label: "Cargo",
                type: 'select',
                storeOpcoes: {
                    store: usePerfilStore,
                    action: 'fetchPerfis',
                    stateProp: 'getPerfisSelect',
                    abrirModal: 'toggleModalNovoPerfil'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'id_escala',
                label: "Escala",
                type: 'select',
                storeOpcoes: {
                    store: useCargaHorariaStore,
                    action: 'fetchEscala',
                    stateProp: 'getEscalaParaSelect',
                    abrirModal: 'setModalEscalaAberto'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'id_tipo',
                label: "Tipo",
                type: 'select',
                storeOpcoes: {
                    store: useCargaHorariaStore,
                    action: 'fetchHorarioTipo',
                    stateProp: 'getHorarioTipoParaSelect',
                    abrirModal: 'setModalHorarioTipoAberto'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            }
        ]
    }

];

export const enviarCadastroFuncionarioCPF = async (formulario: { titulo: string; itens: FormularioInterface[] }[]) => {
    const pessoaStore = usePessoaStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return {status: 422, json: {}}

    const formData = criarFormData(formulario)
    const cpf = formData.get("cpf") as string
    return await pessoaStore.fetchPorCpf(cpf).then(() => {
        const pessoa = pessoaStore.getPessoaPorCpf

        alertStore.mostrarAlerta('info', 'Pessoa ja existe! Cadastre as informações que faltam')
        return {status: 200, json: pessoa}
    }).catch(e => {
        if(e.statusCode === 404) {

            alertStore.mostrarAlerta('info', 'Cadastre as informações que faltam')
            return {status: 404, json: {cpf: cpf}}
        } else {
            alertStore.mostrarAlerta('error', 'Erro ao cadastrar CPF')
            return {status: 500, json: {}}
        }
    })
}

export const enviarCadastroFuncionario = async (
    formulario: { titulo: string; itens: FormularioInterface[] }[],
    imagem: {value: File | null, erro: string, mimeType: string} = {value: null, erro: '', mimeType: ''}
) => {
    const funcionarioStore = useFuncionarioStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate(formulario)
    imagem.erro = ValidateForm.arquivoValidacao(imagem.value, imagem.mimeType)

    if(!validacao && imagem.erro.length > 0) return {status: 422}

    let dataEnvio;

    if (imagem.value) {
        dataEnvio = criarFormData(formulario)
        dataEnvio.append('imagem', imagem.value);
    } else {
        dataEnvio = formatFormToJson(formulario)
    }

    return await funcionarioStore.fetchCadastrarFuncionario(dataEnvio).then((response) => {
        alertStore.mostrarAlerta('success', 'Funcionario cadastrado com sucesso!')
        return {status: 200}
    }).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {status: 500}
    })
}
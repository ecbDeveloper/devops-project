import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const cadastrarDependenteCPF = [
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

export const cadastrarDependenteDocumento = [
    {
        titulo: '',
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
                obrigatorio: false
            },
            {
                nome: 'orgao_emissor',
                label: "Órgão Emissor",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: false
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
                obrigatorio: false
            }
        ]
    }

];

export const cadastrarDependenteParentesco = [
    {
        titulo: '',
        itens: [
            {
                nome: 'parentesco',
                label: "Parentesco",
                type: 'select',
                opcoes: [
                    { value: "Companheiro(a)", texto: "Companheiro(a)" },
                    { value: "Cônjuge", texto: "Cônjuge" },
                    { value: "Enteado(a)", texto: "Enteado(a)" },
                    { value: "Ex-cônjuge", texto: "Ex-cônjuge" },
                    { value: "Filho(a)", texto: "Filho(a)" },
                    { value: "Irmão(ã)", texto: "Irmão(ã)" },
                    { value: "Neto(a)", texto: "Neto(a)" },
                    { value: "Pais", texto: "Pais" },
                    { value: "Outra relação de dependência", texto: "Outra relação de dependência" }
                ],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
        ]
    },
];

export const enviarDependenteCPF = async (formulario: { titulo: string; itens: FormularioInterface[] }[]) => {
    const pessoaStore = usePessoaStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return {json: {}, enviado: false}

    const formData = criarFormData(formulario)
    const cpf = formData.get("cpf") as string

    if(cpf === pessoaStore.getPessoa.cpf) {
        alertStore.mostrarAlerta('error', 'O funcionario não pode ser dependente de si mesmo')
        return {json: {}, enviado: false}
    }

    return await pessoaStore.fetchPorCpf(cpf).then(() => {
        const pessoa = pessoaStore.getPessoaPorCpf
        alertStore.mostrarAlerta('info', 'Pessoa ja existe no sistema, cadastre as informações que faltam')
        return {json: pessoa, enviado: true}
    }).catch(e => {
        const formData = criarFormData(formulario)
        const json = formDataParaJson(formData)

        alertStore.mostrarAlerta('info', 'Cadastre as informações que faltam')
        return {json: json, enviado: true}
    })

}

export const enviarDependenteDocumento = async (formulario: { titulo: string; itens: FormularioInterface[] }[]) => {
    const pessoaStore = usePessoaStore()
    const alertStore = useAlertStore()

    const validacao1 = await ValidateForm.validate(formulario)

    if(!validacao1) return {json: {}, enviado: false}

    const formData = criarFormData(formulario)

    const json = formDataParaJson(formData);

    return await pessoaStore.fetchPessoa(json).then((response) => {
        const pessoa = pessoaStore.getPessoaCadastrada
        pessoaStore.setPessoaPorCpf(pessoa)
        alertStore.mostrarAlerta('success', 'Pessoa cadastrada continue com o cadastro do parentesco!')
        return {json: {}, enviado: true}
    }).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {json: {}, enviado: false}
    })
}

export const enviarDependente = async (formulario: { titulo: string; itens: FormularioInterface[] }[], id_pessoa_dependente: number, id_pessoa_titular: number) => {
    const dependenteStore = useDependenteStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return {json: {}, enviado: false}

    const formData = criarFormData(formulario)

    const json = formDataParaJson(formData);

    return await dependenteStore.fetchCadastrarDependentes(id_pessoa_titular, id_pessoa_dependente, json).then((response) => {
        alertStore.mostrarAlerta('success', 'Dependente cadastrado com sucesso')
        return {json: {}, enviado: true}
    }).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {json: {}, enviado: false}
    })
}
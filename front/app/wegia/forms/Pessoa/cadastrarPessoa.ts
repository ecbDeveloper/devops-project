import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { PessoaInterface } from "~/interface/Pessoa/PessoaInterface";

export const cadastrarPessoaCPF = [
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

export const cadastrarPessoaAtendido = [
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
                obrigatorio: true,
                desabilitado: false
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
                desabilitado: false,
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCpf,
                validacao: ValidateForm.cpfValidacao,
                obrigatorio: true
            }
        ]
    }

];

export const enviarCadastroPessoaCPF = async (formulario: { titulo: string; itens: FormularioInterface[] }[]) => {
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

export const enviarCadastroPessoa = async (
    formulario: { titulo: string; itens: FormularioInterface[] }[],
    imagem: {value: File | null, erro: string, mimeType: string} = {value: null, erro: '', mimeType: ''}
) => {
    const alertStore = useAlertStore()
    const pessoaStore = usePessoaStore()

    const validacao = await ValidateForm.validate(formulario)
    if(!validacao) return {status: 422}

    const formData = criarFormData(formulario)
    const json = formDataParaJson(formData)

    return await pessoaStore.fetchPessoa(json).then(() => {
        alertStore.mostrarAlerta('success', 'Pessoa cadastrada com sucesso!')
        return {status: 200}
    }
    ).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {status: 500}
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

    const formData = criarFormData(formulario)
    if (imagem.value) {
        formData.append('imagem', imagem.value);
    }

    return await funcionarioStore.fetchCadastrarFuncionario(formData).then((response) => {
        alertStore.mostrarAlerta('success', 'Funcionario cadastrado com sucesso!')
        return {status: 200}
    }).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {status: 500}
    })
}
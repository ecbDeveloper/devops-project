import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import { criarFormData } from '~/utils/FormDataTransform';

export const endereco = [
    {
        titulo: 'Endereço',
        itens: [
            {
                nome: 'cep',
                label: "CEP",
                placeholder: 'Ex: 22222-222',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: '#####-###',
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCep,
                blur: ValidateForm.cepValido,
            },
            {
                nome: 'estado',
                label: "Estado",
                type: 'text',
                max: 2,
                value: '',
                erro: '',
            },
            {
                nome: 'cidade',
                label: "Cidade",
                type: 'text',
                value: '',
                erro: ''
            },
            {
                nome: 'bairro',
                label: "Bairro",
                type: 'text',
                value: '',
                erro: ''
            },
            {
                nome: 'logradouro',
                label: "Logradouro",
                type: 'text',
                value: '',
                erro: '',
            },
            {
                nome: 'numero_endereco',
                label: "Numero residencial",
                type: 'text',
                value: '',
                erro: '',
            },
            {
                nome: 'complemento',
                label: "Complemento",
                type: 'text',
                value: '',
                erro: '',
            },
            {
                nome: 'ibge',
                label: "IBGE",
                type: 'text',
                value: '',
                erro: '',
            },
        ]
    }

];

export const enderecoSocio = {
        titulo: 'Endereço',
        itens: [
            {
                nome: 'cep',
                label: "CEP",
                placeholder: 'Ex: 22222-222',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: '#####-###',
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCep,
                blur: ValidateForm.cepValido,
                obrigatorio: true
            },
            {
                nome: 'estado',
                label: "Estado",
                type: 'text',
                max: 2,
                value: '',
                erro: '',
                obrigatorio: true
            },
            {
                nome: 'cidade',
                label: "Cidade",
                type: 'text',
                value: '',
                erro: '',
                obrigatorio: true
            },
            {
                nome: 'bairro',
                label: "Bairro",
                type: 'text',
                value: '',
                erro: '',
                obrigatorio: true
            },
            {
                nome: 'logradouro',
                label: "Logradouro",
                type: 'text',
                value: '',
                erro: '',
                obrigatorio: true
            },
            {
                nome: 'numero_endereco',
                label: "Numero residencial",
                type: 'text',
                value: '',
                erro: '',
                obrigatorio: true
            },
            {
                nome: 'complemento',
                label: "Complemento",
                type: 'text',
                value: '',
                erro: '',
                obrigatorio: true
            },
            {
                nome: 'ibge',
                label: "IBGE",
                type: 'text',
                value: '',
                erro: '',
            },
        ]
}

export const enviarEndereco = async (formulario: { titulo: string; itens: FormularioInterface[] }[], id_pessoa: number) => {

    const pessoaStore = usePessoaStore()
    const alertStore = useAlertStore()
    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return

    const formData = criarFormData(formulario)
    const json = formDataParaJson(formData);

    await pessoaStore.fetchAtualizarPessoa(json, id_pessoa).then(() => {
        alertStore.mostrarAlerta('success', 'Informações pessoais atualizadas com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao atualizar!')
    })
}
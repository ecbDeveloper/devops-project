import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import { criarFormData } from '~/utils/FormDataTransform';

export const cepInstituicao = {
        titulo: 'Endereço da instituição',
        itens: [
            {
                nome: 'nome',
                label: "Nome da instituição",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
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
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'estado',
                label: "Estado",
                type: 'text',
                value: '',
                erro: '',
                mask: '##',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'cidade',
                label: "Cidade",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'bairro',
                label: "Bairro",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'logradouro',
                label: "Logradouro",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'numero_endereco',
                label: "Numero residencial",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'complemento',
                label: "Complemento",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'ibge',
                label: "IBGE",
                type: 'text',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
        ]
}

export const enviarEndereco = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

    const configuracaoEnderecoInstituicaoStore = useConfiguracaoEnderecoInstituicaoStore()
    const alertStore = useAlertStore()
    const validacao = await ValidateForm.validate([formulario])

    if(!validacao) return

    const json = formatFormToJson([formulario])

    await configuracaoEnderecoInstituicaoStore.fetchAtualizarEndereco(json).then(() => {
        alertStore.mostrarAlerta('success', 'Informações de endereço atualizadas com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao atualizar endereço!')
    })
}
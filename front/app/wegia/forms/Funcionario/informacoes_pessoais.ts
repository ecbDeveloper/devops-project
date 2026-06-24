import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import { criarFormData } from '~/utils/FormDataTransform';

export const informacoesPessoais = [
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
                    { value: 'm', texto: "Masculino", icon: 'fas fa-mars' },
                    { value: 'f', texto: "Feminino", icon: 'fas fa-venus' }
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
                label: "Data de nascimento",
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: Mascara.data,
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarDataParaBR,
                validacao: ValidateForm.dataMenorQueHoje
            },
            {
                nome: 'nome_pai',
                label: "Nome do pai",
                type: 'text',
                value: '',
                erro: '',
            },
            {
                nome: 'nome_mae',
                label: "Nome do mãe",
                type: 'text',
                value: '',
                erro: '',
            },
            {
                nome: 'tipo_sanguineo',
                label: "Tipo Sanguineo",
                type: 'select',
                opcoes: [
                    { value: "A+", texto: "A+" },
                    { value: "A-", texto: "A-" },
                    { value: "B+", texto: "B+" },
                    { value: "B-", texto: "B-" },
                    { value: "O+", texto: "O+" },
                    { value: "O-", texto: "O-" },
                    { value: "AB+", texto: "AB+" },
                    { value: "AB-", texto: "AB-" }
                ],
                value: '',
                erro: '',
            },
        ]
    }

];

export const enviarInformacoesPessoais = async (formulario: { titulo: string; itens: FormularioInterface[] }[], id_pessoa: number) => {

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
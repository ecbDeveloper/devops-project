import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import { criarFormData } from '~/utils/FormDataTransform';

export const documentacao = [
    {
        titulo: 'Documentação',
        itens: [
            {
                nome: 'registro_geral',
                label: "Numero de RG",
                placeholder: 'Ex: 22.222.222-2',
                type: 'text',
                mask: '##.###.###-#',
                value: '', 
                erro: '',
                regex: /\D/g, 
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarRg,
                validacao: ValidateForm.validacaoRg,
            },
            {
                nome: 'orgao_emissor',
                label: "Órgão Emissor",
                type: 'text',
                value: '',
                erro: '',
            },
            {
                nome: 'data_expedicao',
                label: "Data de expedição",
                placeholder: 'dd/mm/aaaa',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: '##/##/####',
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                validacao: ValidateForm.dataMenorQueHoje,
            },
            {
                nome: 'cpf',
                label: "Número do CPF",
                type: 'text',
                value: '',
                erro: '',
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCpf,
                desabilitado: true
            },
        ]
    }
        
];

export const enviarDocumentacao = async (formulario: { titulo: string; itens: FormularioInterface[] }[], id_pessoa: number) => {

    const pessoaStore = usePessoaStore()
    const alertStore = useAlertStore()
    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return

    const formData = criarFormData(formulario)
    formData.delete('cpf'); 
    const json = formDataParaJson(formData);

    await pessoaStore.fetchAtualizarPessoa(json, id_pessoa).then(() => {
        alertStore.mostrarAlerta('success', 'Documentação atualizada com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao atualizar!')
    })
}
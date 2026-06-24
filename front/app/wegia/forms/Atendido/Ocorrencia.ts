import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const cadastrarOcorrencia = [
    {
        titulo: '',
        itens: [
            {
                nome: 'atendido_ocorrencia_tipos_idatendido_ocorrencia_tipos',
                label: "Tipo de ocorrência:",
                type: 'select',
                storeOpcoes: {
                    store: useOcorrenciaStore,
                    action: 'fetchBuscarOcorrenciaTipo',
                    stateProp: 'getOcorrenciaTipoSelect'
                },
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'data',
                label: "Data da ocorrência:",
                placeholder: 'DD/mm/aaaa',
                type: 'text',
                value: '',
                erro: '',
                regex: /\D/g,
                mask: '##/##/####',
                formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'arquivo',
                label: "Arquivo",
                type: 'file',
                value: '',
                erro: '',
            },
            {
                nome: 'descricao',
                label: "Descrição ocorrência",
                type: 'textarea',
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            }
        ]
    }
        
];

export const enviarOcorrencia = async (
    formulario: { titulo: string; itens: FormularioInterface[] }[],
    id_atendido: number,
    id_funcionario: number,
) => {
    const ocorrenciaStore = useOcorrenciaStore();
    const alertStore = useAlertStore();
   
    const validacao = await ValidateForm.validate(formulario)
    if(!validacao) return {status: 422, json: {}}

    const formData = criarFormData(formulario)
    formData.append('funcionario_id_funcionario', id_funcionario)

    return await ocorrenciaStore.fetchOcorrencia(formData, id_atendido).then((response) => {
        alertStore.mostrarAlerta('success', 'Ocorrencia cadastrada com sucesso!')
        return {status: 200}
    }).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {status: 500}
    })
}
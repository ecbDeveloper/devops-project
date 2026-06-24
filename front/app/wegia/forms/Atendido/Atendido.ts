import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const cadastrarAtendido = [
    {
        titulo: 'Cadastro Atendido',
        itens: [
            {
                nome: 'atendido_status_idatendido_status',
                label: "Status",
                type: 'select',
                storeOpcoes: {
                    store: useAtendidoStore,
                    action: 'fetchBuscarStatus',
                    stateProp: 'getAtendidoStatusSelect'
                },
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'atendido_tipo_idatendido_tipo',
                label: "Tipo",
                type: 'select',
                storeOpcoes: {
                    store: useAtendidoStore,
                    action: 'fetchBuscarTipo',
                    stateProp: 'getAtendidoTipoSelect'
                },
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            }
        ]
    }

];

export const enviarCadastroAtendido = async (
    formulario: { titulo: string; itens: FormularioInterface[] }[],
    id_pessoa: number
) => {
    const atendidoStore = useAtendidoStore();
    const alertStore = useAlertStore();

    const validacao = await ValidateForm.validate(formulario)
    if(!validacao) return {status: 422, json: {}}

    const formData = criarFormData(formulario)
    const json : { [key: string]: any } = formDataParaJson(formData)
    json.pessoa_id_pessoa = id_pessoa

    return await atendidoStore.fetchAtendido(json).then((response) => {
        alertStore.mostrarAlerta('success', 'Funcionario cadastrado com sucesso!')
        return {status: 200}
    }).catch(e => {
        alertStore.mostrarAlerta('error', 'Erro ao realizar o cadastro!')
        return {status: 500}
    })
}
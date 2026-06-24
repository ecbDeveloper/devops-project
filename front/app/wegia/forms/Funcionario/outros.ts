import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";

export const outros = [
    {
        titulo: 'Outros',
        itens: [
            {
                nome: 'pis',
                label: "PIS (Número de Identificação do Trabalhador)",
                placeholder: 'Ex: 123.45678.91-0',
                type: 'text',
                mask: '###.#####.##-#',
                value: '',
                erro: '',
                regex: /\D/g,
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarPIS,
                validacao: ValidateForm.validarPIS,
            },
            {
                nome: 'ctps',
                label: "CTPS (Carteira de Trabalho e Previdência Social)",
                placeholder: 'Ex: 1234567/8910',
                type: 'text',
                mask: '#######/####',
                regex: /\D/g,
                formatarParaEnviar: [/\D/g, ''],
                formatarParaAdicionarNoForm: FormatarParaForm.formatarCTPS,
                validacao: ValidateForm.validarCTPS,
                value: '',
                erro: '',
            },
            {
                nome: 'uf_ctps',
                label: "Estado CTPS",
                type: 'text',
                value: '',
                erro: '',
                max: 2,
            },
            {
                nome: 'numero_titulo',
                label: "Título de Eleitor",
                type: 'text',
                placeholder: 'Ex: 123456789012',
                value: '',
                erro: '',
                regex: /\D/g,
                max: 12,
                formatarParaEnviar: [/\D/g, ''],
                validacao: ValidateForm.validarTituloEleitor,
            },
            {
                nome: 'zona',
                label: "Zona Eleitoral",
                placeholder: '123',
                type: 'text',
                value: '',
                erro: '',
                max: 3,
            },
            {
                nome: 'secao',
                label: "Seção do Título de Eleitor",
                placeholder: '1234',
                type: 'text',
                value: '',
                erro: '',
                max: 4,
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
                desabilitado: true
            },
        ]
    }

];

export const enviarOutros = async (formulario: { titulo: string; itens: FormularioInterface[] }[], id_funcionario: number) => {

    const funcionario = useFuncionarioStore()
    const alertStore = useAlertStore()
    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return

    const formData = criarFormData(formulario)
    formData.delete('cpf');
    const json = formDataParaJson(formData) as JSON;

    await funcionario.fetchAtualizarFuncionario(json, id_funcionario).then((response) => {
        alertStore.mostrarAlerta('success', 'Outros atualizado com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao atualizar!')
    })
}
import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import { useCargaHorariaStore } from "~/stores/Funcionario/CargaHoraria";
import { criarFormData } from '~/utils/FormDataTransform';

export const cargaHorariaForm = [
    {
        titulo: 'Carga Horária',
        itens: [
            {
                nome: 'escala',
                label: "Escala",
                type: 'select',
                storeOpcoes: {
                    store: useCargaHorariaStore,
                    action: 'fetchEscala',
                    stateProp: 'getEscalaParaSelect'
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'tipo',
                label: "Tipo",
                type: 'select',
                storeOpcoes: {
                    store: useCargaHorariaStore,
                    action: 'fetchHorarioTipo',
                    stateProp: 'getHorarioTipoParaSelect',
                },
                opcoes: [],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'entrada1',
                label: "Primeira entrada",
                type: 'time',
                placeholder: '--:--',
                mask: "##:##",
                regex: /\D/g,
                formatarParaEnviar: [/\D:/g, ''],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'saida1',
                label: "Primeira saida",
                type: 'time',
                placeholder: '--:--',
                mask: "##:##",
                regex: /\D/g,
                formatarParaEnviar: [/\D:/g, ''],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'entrada2',
                label: "Segunda entrada",
                type: 'time',
                placeholder: '--:--',
                mask: "##:##",
                regex: /\D/g,
                formatarParaEnviar: [/\D:/g, ''],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'saida2',
                label: "Segunda entrada",
                type: 'time',
                placeholder: '--:--',
                mask: "##:##",
                regex: /\D/g,
                formatarParaEnviar: [/\D:/g, ''],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'dias_trabalhados',
                label: "Dias Trabalhados",
                type: 'checkbox',
                opcoes: [
                    {texto: "Seg", value: "seg"},
                    {texto: "Ter", value: "ter"},
                    {texto: "Qua", value: "qua"},
                    {texto: "Qui", value: "qui"},
                    {texto: "Sex", value: "sex"},
                    {texto: "Sab", value: "sab"},
                    {texto: "Dom", value: "dom"},
                    {texto: "Plantão 12/36", value: "12/36"},
                ],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
            {
                nome: 'folga',
                label: "Dias de Folga",
                type: 'checkbox',
                opcoes: [
                    {texto: "Seg", value: "seg"},
                    {texto: "Ter", value: "ter"},
                    {texto: "Qua", value: "qua"},
                    {texto: "Qui", value: "qui"},
                    {texto: "Sex", value: "sex"},
                    {texto: "Sab", value: "sab"},
                    {texto: "Dom", value: "dom"},
                    {texto: "Alternados", value: "Alternados"},
                ],
                value: '',
                erro: '',
                validacao: ValidateForm.obrigatorio,
                obrigatorio: true
            },
        ]
    }

];

export const enviarCargaHoraria = async (formulario: { titulo: string; itens: FormularioInterface[] }[], id_funcionario: number) => {

    const cargaHorariaStore = useCargaHorariaStore()
    const alertStore = useAlertStore()
    const validacao = await ValidateForm.validate(formulario)

    if(!validacao) return

    const formData = criarFormData(formulario)
    const json = formDataParaJson(formData);

    const hora = calcularCargaHorariaSemanal(json)

    json.total = hora.totalSemanal
    json.carga_horaria = hora.totalDiario

    await cargaHorariaStore.fetchCadastrarCargaHoraria(json, id_funcionario).then(() => {
        alertStore.mostrarAlerta('success', 'Documentação atualizada com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao atualizar!')
    })
}

const calcularCargaHorariaSemanal = (json) => {
    const tempo1 = diferencaDeHora(json.entrada1, json.saida1);
    const tempo2 = diferencaDeHora(json.entrada2, json.saida2);

    const minutosTrabalhados = tempo1 + tempo2;
    const horas = Math.floor(minutosTrabalhados / 60);
    const minutos = minutosTrabalhados % 60;
    const diaria = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

    const diasTrabalhados = json.dias_trabalhados ? json.dias_trabalhados.split(',').length : 0;
    const cargaSemanalMin = minutosTrabalhados * diasTrabalhados;
    const cargaSemanalHoras = Math.floor(cargaSemanalMin / 60);
    const cargaSemanalMinutos = cargaSemanalMin % 60;

    return {
        totalDiario: diaria,
        totalSemanal: `${cargaSemanalHoras.toString().padStart(2, '0')}:${cargaSemanalMinutos.toString().padStart(2, '0')}`
    };
};

const diferencaDeHora = (horaInicio: string, horaFim: string) => {
    let inicio = new Date(`1970-01-01T${horaInicio}:00`);
    let fim = new Date(`1970-01-01T${horaFim}:00`);

    if (fim < inicio) {
        fim.setDate(fim.getDate() + 1);
    }

    return (fim.getTime() - inicio.getTime()) / (1000 * 60);
};
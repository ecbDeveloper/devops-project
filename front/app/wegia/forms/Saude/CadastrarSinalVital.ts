export const cadastrarSinalVital = {
  titulo: '',
  itens: [
    {
      nome: 'data',
      label: "Data da aferição",
      placeholder: 'DD/mm/aaaa hh:mm',
      type: 'text',
      value: '',
      erro: '',
      regex: /\D/g,
      mask: '##/##/#### ##:##',
      formatarParaEnviar: [
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
        '$3-$2-$1 $4:$5:00'
      ],
      validacao: ValidateForm.dataMenorQueHojeComHorario,
      obrigatorio: true,
      bloqueado: false
    },
    {
      nome: 'saturacao',
      label: "Saturação (em %)",
      type: 'text',
      value: '',
      erro: '',
      mask: '##',
      regex: /\D/g,
      max: 2,
      bloqueado: false
    },
    {
      nome: 'pressao_arterial',
      label: "Pressão arterial",
      type: 'text',
      value: '',
      erro: '',
      regex: /\D/g,
      placeholder: 'xxx/xxx',
      mask: '###/###',
      bloqueado: false
    },
    {
      nome: 'frequencia_cardiaca',
      label: "Frequência cardíaca (em bpm)",
      type: 'text',
      value: '',
      erro: '',
      mask: '###',
      regex: /\D/g,
      bloqueado: false
    },
    {
      nome: 'frequencia_respiratoria',
      label: "Frequência respiratoria (em rpm)",
      type: 'text',
      value: '',
      erro: '',
      mask: '##',
      regex: /\D/g,
      bloqueado: false
    },
    {
      nome: 'temperatura',
      label: "Temperatura (em °C)",
      type: 'text',
      value: '',
      erro: '',
      mask: '##',
      regex: /\D/g,
      bloqueado: false
    },
    {
      nome: 'hgt',
      label: "HGT (mg/dL)",
      type: 'text',
      value: '',
      erro: '',
      mask: '###',
      regex: /\D/g,
      bloqueado: false
    }
  ]
}

export const enviarSinalVital = async (
  id: number,
  formulario: { titulo: string; itens: FormularioInterface[] },
) => {

  const saudeSinalVitalStore = useSaudeSinalVitalStore()
  const pessoaStore = usePessoaStore()
  const alertStore = useAlertStore()

  if(!pessoaStore.getPessoa?.funcionario) {
    return alertStore.mostrarAlerta('error', 'Voce não é um funcionario!')
  }

  const validacao = await ValidateForm.validate([formulario])

  if(!validacao)  throw new Error('Formulário inválido')

  const json = formatFormToJson([formulario])
  json.id_funcionario = pessoaStore.getPessoa.funcionario.id_funcionario

  const novoObj = Object.fromEntries(
    Object.entries(json).filter(([_, value]) => value !== "")
  )

  try {
      await saudeSinalVitalStore.fetchCadastrarSinalVital(id, novoObj)

      limparCampos([formulario])

      alertStore.mostrarAlerta('success', 'Sinal vital cadastrada com sucesso!')
      return {status: 200, json}
  } catch (e) {
      alertStore.mostrarAlerta('error', 'Erro ao cadastrar sinal vital!')
      throw e
  }

}
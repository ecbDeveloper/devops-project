export const cadastrarPessoaSocio = {
  titulo: '',
  itens: [
      {
        nome: 'nome',
        label: "Nome Socio",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'cpf',
        label: "Cpf/Cnpj",
        placeholder: "Ex. 000.000.000-00",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.cpfCnpj,
        regex: /\D/g,
        formatarParaEnviar: [/\D/g, ''],
        formatarParaAdicionarNoForm: FormatarParaForm.formatarCpfOuCnpj,
        validacao: ValidateForm.cpfOuCnpjValidacao,
        obrigatorio: true,
        desabilitado: true
      },
      {
        nome: 'telefone',
        label: "Telefone",
        type: 'text',
        value: '',
        erro: '',
          regex: /\D/g,
        mask: '(##) #####-####',
        formatarParaEnviar: [/\D/g, ''],
        validacao: ValidateForm.telefoneValido,
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
        mask: '##/##/####',
        formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
        formatarParaAdicionarNoForm: FormatarParaForm.formatarDataParaBR,
        validacao: ValidateForm.dataMenorQueHoje
      },

  ]
}

export const cadastrarSocio = {
  titulo: '',
  itens: [
      {
        nome: 'email',
        label: "E-mail",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.emailValido,
        obrigatorio: true
      },
      {
        nome: 'data_referencia',
        label: "Data referência (ínicio contribuição)",
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: '##/##/####',
        formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
        validacao: ValidateForm.dataMenorQueHoje,
        obrigatorio: true
      },
      {
        nome: 'valor_periodo',
        label: "Valor/período em R$",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.dinheiro,
        formatarParaEnviar: [/,/g, '.'],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_sociostatus',
        label: "Status",
        type: 'select',
        storeOpcoes: {
          store: useSocioStatusStore,
          stateProp: 'getStatusParaFiltro'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'id_sociotag',
        label: "Grupo",
        type: 'select',
        storeOpcoes: {
          store: useSocioTagStore,
          stateProp: 'getTagsFiltros'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'periodicidade',
        label: "Periodiciade (Contribuinte)",
        type: 'select',
        storeOpcoes: {
          store: useSocioTipoStore,
          stateProp: 'tiposPeriocidade'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'contribuicao',
        label: "Tipo de contribuição",
        type: 'select',
        storeOpcoes: {
          store: useSocioTipoStore,
          stateProp: 'tiposContribuicao'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
  ]
}

export const cadastrarSocioFormExterno = {
  titulo: '',
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
        nome: 'data_nascimento',
        label: "Data de nascimento",
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: Mascara.data,
        formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
        validacao: ValidateForm.dataMenorQueHoje,
        obrigatorio: true
      },
      {
        nome: 'email',
        label: "E-mail",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.emailValido,
        obrigatorio: true,
        desabilitado: false
      },
      {
        nome: 'telefone',
        label: "Telefone",
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: '(##) #####-####',
        validacao: ValidateForm.telefoneValido,
        obrigatorio: true
      },

  ]
}

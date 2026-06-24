

export const procurarSocio = {
  titulo: '',
  itens: [
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
      obrigatorio: true
    }
  ]
}

export const gerarRelatorioSocio = {
  titulo: '',
  itens: [
      {
        nome: 'metodo',
        label: "Metodo",
        type: 'select',
        opcoes: [
          { texto: 'Boleto único', value: 'boleto' },
          { texto: 'Carnê mensal', value: 'carne mensal' },
          { texto: 'Carnê bimestral', value: 'carne bimestral' },
          { texto: 'Carnê trimestral', value: 'carne trimestral' },
          { texto: 'Carnê semestral', value: 'carne semestral' },
        ],
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'data_vencimento',
        label: "Data de vencimento",
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: Mascara.data,
        formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
        formatarParaAdicionarNoForm: FormatarParaForm.formatarDataParaBR,
        validacao: ValidateForm.dataMaiorQueHoje,
        obrigatorio: true
      },
      {
        nome: 'valor',
        label: "Valor",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.dinheiro,
        formatarParaEnviar: [/,/g, '.'],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'modo_geracao',
        label: "Modo de Geração",
        type: 'radio',
        value: 0,
        erro: '',
        opcoes: [
            { value: 0, texto: 'Número Personalizado' },
            { value: 1, texto: 'Até o final do ano' }
        ],
        invisivel: false
      },
      {
        nome: 'parcelas',
        label: "Parcelas",
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: '###',
        invisivel: false,
        desabilitado: true,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true,
      },

  ]
}
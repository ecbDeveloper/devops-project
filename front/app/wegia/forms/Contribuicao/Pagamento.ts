

export const cadastrarValor = {
  titulo: '',
  itens: [
      {
        nome: 'valor',
        label: "Valor da Contribuição",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.dinheiro,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      }
  ]
}

export const cadastrarCartaoCredito = {
  titulo: '',
  itens: [
      {
        nome: 'valor',
        label: "Valor da Contribuição",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.dinheiro,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'numeroCartao',
        label: "Numero do Cartão",
        type: 'text',
        value: '',
        erro: '',
        mask: '#### #### #### ####',
        regex: /\D/g,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'nomeTitular',
        label: "Nome no Cartão",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'validadeCartao',
        label: "Validade (MM/AA)",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.vencimentoCartao,
        regex: /\D/g,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'codigoSeguranca',
        label: "CVV",
        type: 'text',
        value: '',
        erro: '',
        mask: '###',
        regex: /\D/g,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      }
  ]
}

export const cadastrarCarne = {
  titulo: '',
  itens: [
      {
        nome: 'valor',
        label: "Valor da Contribuição",
        type: 'text',
        value: '',
        erro: '',
        mask: Mascara.dinheiro,
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'parcelas',
        label: "Número de Parcelas",
        type: 'select',
        value: '',
        erro: '',
        opcoes: [
            { value: "2", texto: "2x" },
            { value: "3", texto: "3x" },
            { value: "4", texto: "4x" },
            { value: "5", texto: "5x" },
            { value: "6", texto: "6x" },
            { value: "7", texto: "7x" },
            { value: "8", texto: "8x" },
            { value: "9", texto: "9x" },
            { value: "10", texto: "10x" },
            { value: "11", texto: "11x" },
            { value: "12", texto: "12x" },
        ],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      },
      {
        nome: 'data_vencimento',
        label: "Data de Vencimento",
        type: 'select',
        value: '',
        erro: '',
        opcoes: [
            { value: "1", texto: "1" },
            { value: "5", texto: "5" },
            { value: "10", texto: "10" },
            { value: "15", texto: "15" },
            { value: "20", texto: "20" },
            { value: "25", texto: "25" }
        ],
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
      }
  ]
}
export const aceitacaoEtapa = {
  titulo: 'Cadastro Etapa',
  itens: [
    {
        nome: 'id_status',
        label: "Status",
        type: 'select',
        storeOpcoes: {
            store: useAtendidoAceitacaoStore,
            stateProp: 'getStatusParaSelect'
        },
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
        obrigatorio: true
    },
    {
      nome: 'data_inicio',
      label: "Data de Início",
      placeholder: 'DD/mm/aaaa',
      type: 'text',
      value: '',
      erro: '',
      regex: /\D/g,
      mask: Mascara.data,
      formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
      validacao: ValidateForm.obrigatorio,
      obrigatorio: true
    },
    {
      nome: 'data_fim',
      label: "Data de Fim",
      placeholder: 'DD/mm/aaaa',
      type: 'text',
      value: '',
      erro: '',
      regex: /\D/g,
      mask: Mascara.data,
      formatarParaEnviar: [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1'],
      invisivel: true
    },
    {
      nome: 'descricao',
      label: "Descrição",
      type: 'textarea',
      value: '',
      erro: '',
      validacao: ValidateForm.obrigatorio,
      obrigatorio: true
    }
  ]
}

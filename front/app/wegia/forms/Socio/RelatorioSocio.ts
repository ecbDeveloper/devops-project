
export const gerarRelatorioSocio = {
  titulo: '',
  itens: [
      {
        nome: 'tipo_socio',
        label: "Sócios",
        type: 'select',
        opcoes: [
          { texto: 'Casuais', value: 'Casual' },
          { texto: 'Mensais', value: 'Mensal' },
          { texto: 'Bimestrais', value: 'Bimestral' },
          { texto: 'Trimestrais', value: 'Trimestral' },
          { texto: 'Semestrais', value: 'Semestral' },
        ],
        value: '',
        erro: '',
      },
      {
        nome: 'tipo_pessoa',
        label: "Pessoas",
        type: 'select',
        opcoes: [
          { texto: 'Fisicas', value: 'f' },
          { texto: 'Jurídicas', value: 'j' },
        ],
        value: '',
        erro: '',
      },
      {
        nome: 'id_status',
        label: "Status",
        type: 'select',
        storeOpcoes: {
          store: useSocioStatusStore,
          stateProp: 'getStatusParaFiltro'
        },
        value: '',
        erro: ''
      },
      {
        nome: 'valor_filtro',
        label: "Valor",
        type: 'select',
        opcoes: [
          { texto: 'Maior que', value: 'maior' },
          { texto: 'Maior ou igual que', value: 'maior_igual' },
          { texto: 'Igual a', value: 'igual' },
          { texto: 'Menor que', value: 'menor' },
          { texto: 'Menor ou igual que', value: 'menor_igual' },
        ],
        value: '',
        erro: '',
      },
      {
        nome: 'valor',
        label: "",
        type: 'text',
        value: '',
        erro: '',
        regex: /\D/g,
        mask: Mascara.dinheiro,
      },
      {
        nome: 'id_tag',
        label: "Tag (grupo)",
        type: 'select',
        storeOpcoes: {
          store: useSocioTagStore,
          stateProp: 'getTagsFiltros'
        },
        value: '',
        erro: ''
      },

  ]
}
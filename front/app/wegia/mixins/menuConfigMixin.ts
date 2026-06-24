export const menuConfigMixin = ref([
    {
        nome: 'Inicio', icone: 'fas fa-home', link: '/', submenu: [],
    },
    {
        nome: 'Pessoas',
        icone: 'far fa-address-book',
        link: '',
        permissao: [Permissao.CRIAR_FUNCIONARIO, Permissao.VISUALIZAR_FUNCIONARIO, Permissao.CRIAR_ATENDIDO, Permissao.VISUALIZAR_ATENDIDO],
        submenu: [
            { nome: 'Funcionários', icone: 'fa fa-briefcase', link: '', permissao: [Permissao.CRIAR_FUNCIONARIO, Permissao.VISUALIZAR_FUNCIONARIO], submenu:
                [
                    { nome: 'Cadastrar Funcionário', icone: '', link: '/funcionario/cadastrar', submenu: [], permissao: Permissao.CRIAR_FUNCIONARIO },
                    { nome: 'Informações Funcionários', icone: '', link: '/funcionario', submenu: [], permissao: Permissao.VISUALIZAR_FUNCIONARIO }
                ]
            },
            { nome: 'Atendidos', icone: 'fa fa-user', link: '', permissao: [Permissao.CRIAR_ATENDIDO, Permissao.VISUALIZAR_ATENDIDO], submenu:
                [
                    { nome: 'Processo de aceitacao', icone: 'fa fa-check-circle', link: '/atendido/aceitacao', submenu: [], permissao: ''},
                    { nome: 'Cadastrar Atendido', icone: 'fa fa-address-book', link: '/atendido/cadastrar', submenu: [], permissao: Permissao.CRIAR_ATENDIDO },
                    { nome: 'Informações Atendidos', icone: 'far fa-address-card', link: '/atendido', submenu: [], permissao: Permissao.VISUALIZAR_ATENDIDO }
                ]
            }
        ],
    },
    {
        nome: 'Pet', icone: 'fa-solid fa-paw', link: '', permissao: [Permissao.CRIAR_MEDICAMENTO, Permissao.VISUALIZAR_MEDICAMENTO, Permissao.CRIAR_PET, Permissao.VISUALIZAR_PET], submenu: [
            { nome: 'Cadastrar Pet', icone: 'fa-solid fa-paw', link: '/pet/cadastrar', submenu: [], permissao: Permissao.CRIAR_PET },
            { nome: 'Informações Pet', icone: 'fa-regular fa-file', link: '/pet/', submenu: [], permissao: Permissao.VISUALIZAR_PET },
            {
                nome: 'Medicamentos Pets',
                icone: 'fa-solid fa-pump-medical',
                link: '',
                permissao: [Permissao.CRIAR_MEDICAMENTO, Permissao.VISUALIZAR_MEDICAMENTO],
                submenu: [
                    { nome: 'Cadastrar Medicamentos', icone: '', link: '/pet/cadastrar/medicamento', submenu: [], permissao: Permissao.CRIAR_MEDICAMENTO },
                    { nome: 'Informações Medicamentos', icone: '', link: '/pet/medicamento', submenu: [], permissao: Permissao.VISUALIZAR_MEDICAMENTO }
                ]
            }
        ]
    },
    {
        nome: 'Material e Patrimônio',
        icone: 'fa-solid fa-copy',
        link: '',
        permissao: [
            Permissao.CRIAR_MATERIAL_ENTRADA, Permissao.VISUALIZAR_MATERIAL_ENTRADA, Permissao.CRIAR_MATERIAL_SAIDA,
            Permissao.VISUALIZAR_MATERIAL_SAIDA, Permissao.VISUALIZAR_MATERIAL_PRODUTO, Permissao.VISUALIZAR_MATERIAL_ALMOXARIFADO,
            Permissao.VISUALIZAR_MATERIAL_RELATORIO, Permissao.VISUALIZAR_MATERIAL_UNIDADE, Permissao.VISUALIZAR_MATERIAL_CATEGORIA,
            Permissao.VISUALIZAR_MATERIAL_TIPO_MOVIMENTACAO, Permissao.VISUALIZAR_MATERIAL_ORIGEM_SAIDA
        ],
        submenu: [
            { nome: 'Entrada', icone: 'fas fa-circle-arrow-down', link: '', submenu: [
                { nome: 'Cadastrar Entrada', icone: '', link: '/material/entrada/cadastrar', submenu: [], permissao: Permissao.CRIAR_MATERIAL_ENTRADA },
                { nome: 'Lista de Entrada', icone: '', link: '/material/entrada', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_ENTRADA }
            ], permissao: [Permissao.CRIAR_MATERIAL_ENTRADA, Permissao.VISUALIZAR_MATERIAL_ENTRADA] },

            { nome: 'Saida', icone: 'fas fa-circle-arrow-up', link: '', submenu: [
                { nome: 'Cadastrar Saida', icone: '', link: '/material/saida/cadastrar', submenu: [], permissao: Permissao.CRIAR_MATERIAL_SAIDA },
                { nome: 'Lista de Saida', icone: '', link: '/material/saida', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_SAIDA }
            ], permissao: [Permissao.CRIAR_MATERIAL_SAIDA, Permissao.VISUALIZAR_MATERIAL_SAIDA] },

            { nome: 'Estoque', icone: 'fa-solid fa-boxes', link: '', submenu: [
                { nome: 'Produtos', icone: 'fas fa-boxes-stacked', link: '/material/produto', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_PRODUTO },
                { nome: 'Almoxarifado', icone: 'fas fa-warehouse', link: '/material/almoxarifado', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_ALMOXARIFADO },
                { nome: 'Gerar Relatório', icone: 'fa fa-clipboard', link: '/material/relatorio', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_RELATORIO },
            ], permissao: [Permissao.VISUALIZAR_MATERIAL_PRODUTO, Permissao.VISUALIZAR_MATERIAL_ALMOXARIFADO, Permissao.VISUALIZAR_MATERIAL_RELATORIO] },

            { nome: 'Outros', icone: 'fas fa-toolbox', link: '', submenu: [
                { nome: 'Unidades', icone: 'fas fa-ruler-combined', link: '/material/unidade', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_UNIDADE },
                { nome: 'Categorias', icone: 'fas fa-tags', link: '/material/categoria', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_CATEGORIA },
                { nome: 'Tipos', icone: 'fas fa-layer-group', link: '/material/tipo', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_TIPO_MOVIMENTACAO },
                { nome: 'Origem e Saida', icone: 'fas fa-right-left', link: '/material/origem-saida', submenu: [], permissao: Permissao.VISUALIZAR_MATERIAL_ORIGEM_SAIDA },
            ], permissao: [Permissao.VISUALIZAR_MATERIAL_UNIDADE, Permissao.VISUALIZAR_MATERIAL_CATEGORIA, Permissao.VISUALIZAR_MATERIAL_TIPO_MOVIMENTACAO, Permissao.VISUALIZAR_MATERIAL_ORIGEM_SAIDA ] },
        ]
    },
    {
        nome: 'Memorando',
        icone: 'fa-solid fa-file-lines',
        link: '',
        permissao: [Permissao.CRIAR_MEMORANDO, Permissao.VISUALIZAR_MEMORANDO, Permissao.VISUALIZAR_MEMORANDO],
        submenu: [
            { nome: 'Cadastrar Memorando', icone: '', link: '/memorando/cadastrar', submenu: [], permissao: Permissao.CRIAR_MEMORANDO },
            { nome: 'Entrada de Memorando', icone: '', link: '/memorando', submenu: [], permissao: Permissao.VISUALIZAR_MEMORANDO },
            { nome: 'Despacho de Memorando', icone: '', link: '/memorando/despacho', submenu: [], permissao: Permissao.VISUALIZAR_MEMORANDO }
        ]
    },
    {
        nome: 'Saúde',
        icone: 'fa-solid fa-heart-pulse',
        link: '',
        permissao: [Permissao.CRIAR_FICHA_MEDICA, Permissao.VISUALIZAR_FICHA_MEDICA],
        submenu: [
            {
                nome: 'Paciente', icone: 'fa-solid fa-user-injured', link: '', permissao: [Permissao.CRIAR_FICHA_MEDICA, Permissao.VISUALIZAR_FICHA_MEDICA], submenu:
                [
                    {nome: 'Cadastrar Ficha Médica', icone: '', link: '/saude/cadastrar/ficha-medica', permissao: Permissao.CRIAR_FICHA_MEDICA },
                    {nome: 'Fichas Médica', icone: '', link: '/saude/ficha-medica', permissao: Permissao.VISUALIZAR_FICHA_MEDICA }
                ]
            }
        ]
    },
    {
        nome: 'Socios',
        icone: 'fa fa-users',
        link: '',
        permissao: '',
        submenu: [
            {  nome: 'Lista de Sócios', icone: 'fa fa-users', link: '/socio', permissao: Permissao.VISUALIZAR_SOCIO, submenu: [] },
            {  nome: 'Relatórios Sócios', icone: 'fa fa-clipboard', link: '/socio/relatorio', permissao: Permissao.VISUALIZAR_SOCIO_RELATORIO, submenu: [] },
            {  nome: 'Contribuições', icone: 'fa fa-money-bill', link: '', permissao: '', submenu:
                [
                    { nome: 'Gerar carnê/boleto para sócio', icone: '', link: '/socio/gerar-carne-boleto', permissao: '', submenu: [] },
                    { nome: 'Controle de Contribuições', icone: '', link: '/socio/controle-contribuicao', permissao: Permissao.VISUALIZAR_CONTRIBUICOES, submenu: [] }
                ]
            },
            {  nome: 'Extra', icone: 'far fa-plus-square', link: '', permissao: [Permissao.VISUALIZAR_TAG_SOCIO], submenu:
                [
                    { nome: 'Tags', icone: '', link: '/socio/tag', permissao: Permissao.VISUALIZAR_TAG_SOCIO, submenu: [] },
                ]
            },
        ]
    },
    {
        nome: 'Contribuição',
        icone: 'fa-solid fa-hand-holding-heart',
        link: '',
        permissao: [ Permissao.VISUALIZAR_GATEWAY_DE_CONTRIBUICAO, Permissao.VISUALIZAR_MEIO_PAGAMENTO_DE_CONTRIBUICAO, Permissao.VISUALIZAR_REGRAS_PAGAMENTO_DE_CONTRIBUICAO ],
        submenu: [
            {  nome: 'Meio de pagamento', icone: 'fa-regular fa-credit-card', link: '/contribuicao/meio-pagamento', submenu: [], permissao: Permissao.VISUALIZAR_MEIO_PAGAMENTO_DE_CONTRIBUICAO },
            {  nome: 'Regras de pagamento', icone: 'fa-solid fa-circle-exclamation', link: '/contribuicao/meio-pagamento/regra', submenu: [], permissao: Permissao.VISUALIZAR_REGRAS_PAGAMENTO_DE_CONTRIBUICAO }
        ]
    },
    {
        nome: 'Configuração',
        icone: 'fa-solid fa-gear',
        link: '',
        submenu: [
            {  nome: 'Editar Conteudos', icone: 'fa fa-font', link: '/configuracao/editar-conteudos', permissao: '' },
            {  nome: 'Permissoes', icone: 'fa-solid fa-user-shield', link: '/configuracao/permissao', permissao: Permissao.VISUALIZAR_PERMISSAO }
        ]
    }
]);


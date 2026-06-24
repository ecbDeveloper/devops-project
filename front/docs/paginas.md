# Páginas

## Módulos e páginas principais

- **Home**: `/`
- **Autenticação**: `/login`
- **Funcionário**: `/funcionario`, `/funcionario/cadastrar`, `/funcionario/:id`
- **Atendido**: `/atendido`, `/atendido/cadastrar`, `/atendido/:id`, `/atendido/aceitacao`, `/atendido/aceitacao/:id`
- **Pet**: `/pet`, `/pet/cadastrar`, `/pet/:id`, `/pet/medicamento`, `/pet/cadastrar/medicamento`, `/pet/medicamento/:id`
- **Saúde**: `/saude/cadastrar/ficha-medica`, `/saude/ficha-medica`, `/saude/ficha-medica/:id`
- **Material**: `/material/entrada`, `/material/entrada/cadastrar`, `/material/saida`, `/material/saida/cadastrar`, `/material/produto`, `/material/almoxarifado`, `/material/unidade`, `/material/categoria`, `/material/tipo`, `/material/origem-saida`, `/material/relatorio`
- **Memorando**: `/memorando`, `/memorando/cadastrar`, `/memorando/:id`, `/memorando/despacho`
- **Sócio**: `/socio`, `/socio/relatorio`, `/socio/gerar-carne-boleto`, `/socio/controle-contribuicao`, `/socio/tag`
- **Contribuição**: `/contribuicao`, `/contribuicao/segunda-via`, `/contribuicao/gerar-comprovante`, `/contribuicao/meio-pagamento`, `/contribuicao/meio-pagamento/regra`
- **Configuração**: `/configuracao/editar-conteudos`, `/configuracao/permissao`
- **Avisos**: `/aviso`, `/aviso/:id`
- **Dependente**: `/dependente/:id`

## Fluxo de navegação

- Entrada autenticada padrão: `/` (menu em cards)
- Navegação principal: `Menu/NavBar` e configuração em `mixins/menuConfigMixin.ts`
- Navegação pública de contribuição: páginas com `layout: false`

## Relação páginas x permissão

Consulte [Rotas](rotas.md) e [Permissões](permissoes.md).

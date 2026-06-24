# Projeto - API (Backend)

A arquitetura do projeto divide as rotas em um arquivo principal (`routes/api.php`) e rotas modulares localizadas dentro da pasta `Modules`.

## 📌 Rotas Principais (Core)

Rotas base do sistema, responsáveis pelas funcionalidades fundamentais e gestão de acessos.

| Prefixo da Rota | Responsabilidade |
| --- | --- |
| `/upload` | Realiza o upload de arquivos de imagem e gerencia seu retorno. |
| `/auth` | Autenticação do sistema, incluindo login e logout. |
| `/aviso` | Criação, busca, desativação e gerenciamento de avisos no sistema. |
| `/pessoa` | Gestão de dados de pessoas (usuários base), incluindo filtro de logados, gerenciamento de dependentes, arquivos associados, fotos de perfil e alteração de senha. |
| `/funcionario` | Gestão completa de funcionários da instituição. Engloba o controle de documentos, perfis e permissões, remuneração, escalas e quadro de horários, bem como dados dos dependentes do funcionário. |
| `/situacao` | Cadastro e exclusão de situações/status genéricos para categorização no sistema. |
| `/cargo` | Cadastro, busca e deleção dos cargos profissionais da instituição. |
| `/atendido` | Gerenciamento de pessoas assistidas pela instituição. Inclui tipos e status de atendidos, registro de ocorrências (histórico) e a gestão completa do "processo de aceitação" (etapas, arquivos e validações). |
| `/configuracao` | Configurações institucionais. Permite gerenciar contatos, endereços, seleção de parágrafos em documentos padrão e um banco de imagens da instituição. |

---

## 📦 Rotas Modulares

O backend utiliza uma estrutura de módulos (`Modules`) para separar as funcionalidades especialistas de diferentes nichos de atuação da instituição.

### Módulo: Contribuição de Sócios (`ContribuicaoSocios`)

Responsável pela gestão financeira e associativa da instituição.

* **`/contribuicao`**: Gestão dos pagamentos, sincronização, segundas vias e geração de comprovantes.
* **`/gateway` e `/meio-pagamento`**: Integração e gerenciamento de gateways e formas de pagamento.
* **`/regra`**: Configuração de regras e conjuntos de regras aplicáveis às contribuições financeiras.
* **`/socio`**: Gestão completa de sócios, listagem de aniversariantes, associação a CPFs, status, tipos, estatísticas, relatórios de doadores e tags.

### Módulo: Material (`Material`)

Responsável pela gestão de estoque e almoxarifado.

* **`/material` / `/almoxarifado`**: Gerencia o estoque de materiais gerais.
* **`/parceiro`**: Gestão de parceiros/fornecedores.
* **`/produto` / `/categoria` / `/unidade`**: Cadastro dos itens disponíveis, categorização e definição de unidades de medida (kg, unidade, etc.).
* **`/transacao`**: Histórico de entradas, saídas e movimentações (transações) dos produtos.

### Módulo: Memorando (`Memorando`)

Responsável pela comunicação corporativa interna.

* **`/memorando`**: Criação, edição e acompanhamento de memorandos institucionais.
* **`/despacho`**: Gestão de despachos atrelados aos memorandos para controle de encaminhamento de decisões.

### Módulo: Pet (`Pet`)

Especializado na gestão de animais, caso a instituição atue no ramo de proteção ou serviços animais.

* **`/pet`**: Cadastro geral do animal.
* **`/ficha-medica`**: Acompanhamento do histórico de saúde, atendimentos e estado clínico do animal.
* **`/medicamento` / `/raca` / `/especie`**: Cadastros auxiliares para registro de medicamentos, raças e espécies animais.

### Módulo: Saúde (`Saude`)

Especializado no acompanhamento médico humano (ou gestão de clínicas vinculadas).

* **`/saude/ficha-medica`**: Histórico e prontuário médico completo.
* **`/exame` / `/exame-tipo`**: Requisição, registro de resultados e categorização de exames médicos.
* **`/medico`**: Gestão do corpo clínico responsável pelos atendimentos.
* **`/alergia` / `/cid`**: Cadastros complementares de alergias e mapeamento de diagnósticos pela Classificação Internacional de Doenças (CID).

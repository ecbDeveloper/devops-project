<template>
  <div class="contribuicao-container">
    <div class="contribuicao">
      <img :src="imagemUrl" alt="Logo do sistema" />
      <h2>{{ contribuicaoTexto?.paragrafo }}</h2>

      <div v-if="!socio">
        <h3>Escolha sua forma de contribuição</h3>

        <div class="escolhas">
          <Butao
            texto="Doação Única"
            :class="{ 'ativo': tipoSelecionado === 'unica' }"
            @click="tipoSelecionado = 'unica'"
          />

          <Butao
            texto="Doação Mensal"
            :class="{ 'ativo': tipoSelecionado === 'mensal' }"
            @click="tipoSelecionado = 'mensal'"
            />
        </div>

        <div class="divisor"></div>

        <div v-if="meiosPagamentoFiltrados.length > 0">
          <h3 class="subtitulo">Selecione o meio de pagamento</h3>

          <div class="escolhidos">
            <Butao
              v-for="meio in meiosPagamentoFiltrados"
              :key="meio.id"
              :texto="meio.nomeFormatado"
              :class="{ 'selecionado': meioSelecionado?.id === meio.id }"
              @click="() => tipoEscolhido(meio)"
            />
          </div>
        </div>
        <h3 v-else class="subtitulo">Nenhum meio de pagamento disponível para o tipo selecionado.</h3>
      </div>

      <div v-else>

        <h3>
          Obrigado por contribuir mais uma vez, {{ socio?.nome }}!
        </h3>

        <CardPix
          v-if="pix"
          :qr-code-image="pix.imagem"
          :pix-code="pix.url"
        />

        <span class="texto-guia" v-if="!cobrancaGerada"> Clique em <span>"GERAR COBRANÇA"</span> e aguarde o redirecionamento. </span>


        <span class="texto-guia" v-else> Sua cobrança foi gerada com sucesso! Clique em "Voltar" para realizar uma nova contribuição. </span>

        <div class="botoes-acao" v-if="!isLoading">

          <Butao
            class="voltar"
            texto="Voltar"
            @click="voltar"
          />

          <Butao
            texto="Gerar Cobrança"
            @click="realizarPagamento"
            v-if="!cobrancaGerada"
          />

        </div>

        <Loading v-else />
      </div>

    </div>
  </div>

  <modal-cadastrar-contribuicao
    v-if="modalAberto && meioSelecionado"
    :regras="meioSelecionado?.regras"
    :meioPagamento="meioSelecionado"
    :periodicidade="tipoSelecionado === 'unica' ? 'Casual' : 'Mensal'"
    :gateway="meioSelecionado?.gateway?.plataforma"
    @enviar="enviarCadastro"
    @fechar-modal="modalAberto = false"
  />
</template>

<script setup lang="ts">

definePageMeta({
  layout: false,
  middleware: []
})

const contribuicaoMeioPagamentoStore    = useContribuicaoMeioPagamentoStore()
const contribuicaoPagamentoStore        = useContribuicaoPagamentoStore()
const socioTipoStore                    = useSocioTipoStore()
const configuracaoSelecaoParagrafoStore = useConfiguracaoSelecaoParagrafoStore()
const configuracaoCampoImagemStore      = useConfiguracaoCampoImagemStore()
const alertStore                        = useAlertStore()

const tipoSelecionado = ref<'unica' | 'mensal'>('unica')
const modalAberto     = ref(false)
const isLoading       = ref(false)
const cobrancaGerada  = ref(false)
const pix             = ref<ContribuicaoPagamentoAposCriadoInterface | null>(null)
const token_cartao    = ref<string | null>(null)
const meioSelecionado = ref<ContribuicaoMeioPagamentoAtivoInterface | null>(null)
const socio           = ref<SocioPublicoInterface | null>(null)
const valor           = ref<number>(0)
const parcelas        = ref<number>(1)
const data_vencimento = ref<number>(25)

const meiosPagamentoFiltrados = computed(() => {
  const config = {
    unica: {
      tipos: ['pix', 'boleto', 'cartaocredito'],
      nomes: {
        pix: 'PIX',
        boleto: 'Boleto',
        cartaocredito: 'Cartão de Crédito'
      } as Record<string, string>
    },
    mensal: {
      tipos: ['recorrencia', 'carne'],
      nomes: {
        recorrencia: 'Recorrência',
        carne: 'Carnê',
      } as Record<string, string>
    }
  }

  const tipoAtual = config[tipoSelecionado.value]

  return contribuicaoMeioPagamentoStore.getMeiosAtivos
    .filter((meio) => tipoAtual.tipos.includes(meio.meio?.toLowerCase() || ''))
    .map((meio) => ({
      ...meio,
      nomeFormatado: tipoAtual.nomes[meio.meio?.toLowerCase() || ''] || meio.meio
    }))
})

const contribuicaoTexto = computed(() => configuracaoSelecaoParagrafoStore.getContribuicaoMsg)

const imagemUrl = computed(() => configuracaoCampoImagemStore.getCampoImagemLogoUrl)

const tipoEscolhido = (meio: ContribuicaoMeioPagamentoAtivoInterface) => {
  modalAberto.value = true
  meioSelecionado.value = meio
}

const enviarCadastro = (payload: {
  socio: SocioPublicoInterface | null,
  informacoes: {
    valor: string,
    parcelas?: number,
    data_vencimento?: number
  },
  token_cartao: string | null
}) => {
  socio.value = payload.socio
  valor.value = payload.informacoes.valor.replace(',', '.').toString() as unknown as number
  parcelas.value = payload.informacoes.parcelas || 1
  data_vencimento.value = payload.informacoes.data_vencimento || 25

  if(payload.token_cartao) {
    token_cartao.value = payload.token_cartao
    alertStore.mostrarAlerta('info', 'Processando pagamento com cartão de crédito. Aguarde...')
    realizarPagamento()
  }
}

const realizarPagamento = async () => {
  isLoading.value = true
  pix.value = null
  try {
    await contribuicaoPagamentoStore.fetchPagamento({
      id_socio: socio.value?.id_socio as number,
      id_contribuicao_meioPagamento: meioSelecionado.value?.id as number,
      valor: valor.value,
      parcelas: parcelas.value,
      data_vencimento: data_vencimento.value,
      cartao_hash: token_cartao.value
    })

    let tipoPagamento = ''

    if(!socio.value) return

    tipoPagamento = Pagamento.execucaoAposCriadoPagamento(contribuicaoPagamentoStore.getContribuicaoPagamento, socio.value)

    if(tipoPagamento === 'PIX') pix.value = contribuicaoPagamentoStore.getContribuicaoPagamento[0]

    alertStore.mostrarAlerta('success', `Pagamento via ${tipoPagamento} realizado com sucesso!`)
    cobrancaGerada.value = true

  } catch (error) {
    alertStore.mostrarAlerta('error', `Erro ao realizar pagamento. Tente novamente mais tarde.`)
    console.error('Erro ao realizar pagamento:', error)
  }

  isLoading.value = false
  token_cartao.value = null
}

const voltar = () => {
  socio.value = null
  meioSelecionado.value = null
  cobrancaGerada.value = false
  valor.value = 0
  parcelas.value = 1
  data_vencimento.value = 25
}

onMounted(async () => {
  await contribuicaoMeioPagamentoStore.fetchMeiosAtivos()
  await socioTipoStore.fetchTiposFiltro()
})
</script>

<style scoped lang="scss">
.contribuicao-container {
  align-items: center;
  background: linear-gradient(135deg, $color-tertiary 0%, color-mix(in srgb, $color-tertiary 97%, black) 100%);
  display: flex;
  min-height: 100vh;
  justify-content: center;
  padding: 16px;

  .contribuicao {
    background-color: $color-white;
    padding: 40px 24px 50px 24px;
    width: 100%;
    max-width: 920px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08),
                0 2px 8px rgba(0, 0, 0, 0.04);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    @include sm {
      padding: 50px 40px 60px 40px;
      border-radius: 14px;
    }

    @include md {
      padding: 62px 55px 90px 55px;
      border-radius: 16px;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 56px rgba(0, 0, 0, 0.12),
                    0 4px 12px rgba(0, 0, 0, 0.06);
      }
    }

    img {
      margin: auto;
      width: 120px;
    }


    h2 {
      color: $color-septenary;
      font-family: $font-secondary;
      font-weight: 900;
      font-size: 1.75rem;
      margin-bottom: 16px;
      padding-bottom: 32px;
      text-align: center;
      position: relative;
      letter-spacing: -0.5px;

      @include sm {
        font-size: 2rem;
        padding-bottom: 40px;
      }

      @include md {
        font-size: 2.5rem;
        margin-bottom: 20px;
        padding-bottom: 59px;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, $color-primary 0%, color-mix(in srgb, $color-primary 90%, white) 100%);
        border-radius: 2px;

        @include sm {
          width: 70px;
          bottom: 20px;
        }

        @include md {
          width: 80px;
          height: 4px;
          bottom: 30px;
        }
      }
    }

    h3 {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 16px;
      text-align: center;
      color: $color-octonary;
      letter-spacing: -0.3px;

      @include sm {
        font-size: 1.25rem;
        margin-bottom: 18px;
      }

      @include md {
        font-size: 1.5rem;
        margin-bottom: 20px;
      }
    }

    .subtitulo {
      margin-top: 32px;
      margin-bottom: 20px;

      @include sm {
        margin-top: 36px;
        margin-bottom: 24px;
      }

      @include md {
        margin-top: 40px;
        margin-bottom: 28px;
      }
    }

    .divisor {
      width: 100%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        $color-nonary 20%,
        $color-nonary 80%,
        transparent 100%
      );
      margin: 32px 0;

      @include sm {
        margin: 36px 0;
      }

      @include md {
        margin: 40px 0;
      }
    }

    .escolhas {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
      flex-wrap: wrap;

      @include sm {
        gap: 16px;
        margin-top: 28px;
      }

      @include md {
        gap: 20px;
        margin-top: 32px;
      }

      :deep(button) {
        font-size: 16px;
        height: 44px;
        width: 140px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid $color-primary;
        background-color: $color-white;
        color: $color-primary;
        font-weight: 500;

        @include sm {
          font-size: 18px;
          height: 46px;
          width: 145px;
        }

        @include md {
          font-size: 20px;
          height: 48px;
          width: 150px;
        }

        &:hover {
          background-color: color-mix(in srgb, $color-primary 10%, white);
        }
      }

      :deep(.ativo) {
        background-color: $color-primary;
        color: $color-white;

        &:hover {
          background-color: color-mix(in srgb, $color-primary 90%, white);
        }

        @include md {
          &:hover {
            transform: translateY(-2px);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    }

    .escolhidos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      margin-top: 20px;

      @include sm {
        gap: 14px;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      }

      @include md {
        gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }

      :deep(button) {
        font-size: 15px;
        height: 56px;
        width: 100%;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid $color-secondary;
        background-color: $color-white;
        color: $color-septenary;
        font-weight: 500;
        border-radius: 8px;
        position: relative;
        overflow: hidden;

        @include sm {
          font-size: 16px;
          height: 60px;
        }

        @include md {
          font-size: 17px;
          height: 64px;
          border-radius: 10px;
        }

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: color-mix(in srgb, $color-primary 5%, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover::before {
          opacity: 1;
        }

        &:hover {
          border-color: $color-primary;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 136, 204, 0.15);
        }

        &:active {
          transform: translateY(0);
        }
      }

      :deep(.selecionado) {
        background-color: $color-primary;
        color: $color-white;
        border-color: $color-primary;
        box-shadow: 0 4px 16px rgba(0, 136, 204, 0.25);

        &::before {
          display: none;
        }

        &:hover {
          background-color: color-mix(in srgb, $color-primary 92%, white);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 136, 204, 0.3);
        }
      }
    }

    .texto-guia {
      display: block;
      text-align: center;
      margin-bottom: 24px;
      color: $color-octonary;
      font-size: 1rem;

      @include sm {
        font-size: 1.125rem;
        margin-bottom: 28px;
      }

      @include md {
        font-size: 1.25rem;
        margin-bottom: 32px;
      }

      span {
        text-transform: uppercase;
      }
    }

    .botoes-acao {
      display: flex;
      font-size: 18px;
      gap: 16px;
      justify-content: center;

      .voltar {
        background-color: $color-nonary;
        color: $color-septenary;
        border: 2px solid $color-nonary;

        &:hover {
          background-color: color-mix(in srgb, $color-nonary 90%, white);
        }
      }

      button {
        height: 52px;
      }
    }
  }
}
</style>
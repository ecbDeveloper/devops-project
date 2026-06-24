<template>
  <div class="gerar-comprovante-container">
    <div class="card" >
      <img :src="imagemUrl" alt="Logo do sistema" />
      <h1>Gerar comprovantes Via Email</h1>
      <span class="contato" v-if="contato?.contato">Em caso de duvidas contate <strong>{{ contato?.contato }}</strong></span>
      <div>


        <Forms
          textoBotao="Gerar Comprovante"
          :formulario="formulario"
          @enviar-formulario="enviarEmail"
        />

      </div>
    </div>


  </div>
</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { gerarComprovante } from '~/forms/Contribuicao/GerarComprovante';

definePageMeta({
  layout: false,
  middleware: []
})

const contribuicaoStore                   = useContribuicaoStore()
const configuracaoContatoInstituicaoStore = useConfiguracaoContatoInstituicaoStore()
const configuracaoCampoImagemStore        = useConfiguracaoCampoImagemStore()
const alertStore                          = useAlertStore()

const imagemUrl = computed(() => configuracaoCampoImagemStore.getCampoImagemLogoUrl)
const contato = computed(() => {
  const c = configuracaoContatoInstituicaoStore.getContatos

  return c.length ? c.find(contato => contato.descricao === 'Apoio aos doadores') : null
})

const formulario = ref(gerarComprovante)

const enviarEmail = async () => {

  const validacao = await ValidateForm.validate([formulario.value])

  if(!validacao) return

  const bodyJson = formatFormToJson([formulario.value])

  try {
    await contribuicaoStore.fetchEnviarComprovanteEmail(bodyJson)

    alertStore.mostrarAlerta('success', 'Comprovante enviado com sucesso para o email cadastrado.')

    limparCampos([formulario.value])
  } catch (e) {
    const err = e as FetchError<ErroApiInterface>

    if(err.response?._data?.message === 'Email não foi cadastrado.') alertStore.mostrarAlerta('warning', 'Email não foi cadastrado')

    if(err.response?._data?.message === 'Não existe comprovante para o período informado.') alertStore.mostrarAlerta('warning', 'Não existe comprovante para o período informado')

  }

}

onMounted(async () => {
  if (!configuracaoContatoInstituicaoStore.getContatos.length) await configuracaoContatoInstituicaoStore.fetchContatos()
})

</script>

<style scoped lang="scss">

.gerar-comprovante-container {
  align-items: center;
  background: linear-gradient(135deg, $color-tertiary 0%, color-mix(in srgb, $color-tertiary 97%, black) 100%);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;

  .card {
    background-color: $color-white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
    max-width: 920px;
    padding: 40px 24px 50px 24px;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width: 100%;

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


    h1 {
      color: $color-septenary;
      font-family: $font-secondary;
      font-weight: 900;
      font-size: 1.75rem;
      letter-spacing: -0.5px;
      margin-bottom: 16px;
      padding-bottom: 32px;
      text-align: center;
      position: relative;

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

    .contato {
      background-color: rgba($color-warning, 0.3);
      border-left: 8px solid $color-warning;
      border-radius: 8px;
      display: block;
      padding: 12px;
      width: 100%;
    }
  }

}

</style>
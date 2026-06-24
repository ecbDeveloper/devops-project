<template>
  <div class="segunda-via-container">
    <div class="card" >
      <i
        v-if="mostrarSegundaVia"
        class="fa-solid fa-arrow-left seta"
        @click="mostrarSegundaVia = false"
      ></i>
      <h1>Segunda Via de Boleto e Carnê</h1>
      <div v-if="!mostrarSegundaVia">
        <div>
          <input-text
            placeholder="Digite seu cpf ou cnpj"
            v-model="cpfCnpj"
            :mask=Mascara.cpfCnpj
          />

          <Butao texto="Procurar" @click="buscarSocio" />
        </div>
      </div>

      <div v-else>
        <tabela-schema
          v-if="segundaVia.length > 0"
          titulo="Segunda Via"
          :paginacao="null"
          :atualizacao="0"
          :mostrarPaginacao="false"
          :mostrarFiltros="false"
          :linhas="segundaVia"
          :cabecalhos="[
            { nome: 'Data geração', chave: 'data_geracao', ordenavel: false },
            { nome: 'Data Vencimento', chave: 'data_vencimento', ordenavel: false },
            { nome: 'Ação', chave: 'acao', ordenavel: false }
          ]"
          :acao="['baixar']"
          :habilitarScroll="true"
          @baixar="baixarSegundaVia"
          alturaMaximaTabela="400px"
        />

        <h4 v-else>Nenhuma Segunda Via foi encontrada </h4>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: false,
  middleware: []
})

const contribuicaoStore = useContribuicaoStore()
const alertStore        = useAlertStore()

const segundaVia = computed(() => contribuicaoStore.getSegundaVia)

const cpfCnpj           = ref('')
const mostrarSegundaVia = ref(false)

const buscarSocio = async () => {
  const cpfCnpjLimpo = cpfCnpj.value.replace(/\D/g, '')
  const validacao = ValidateForm.cpfOuCnpjValidacao(cpfCnpjLimpo)
  mostrarSegundaVia.value = false

  if(validacao) {
    return alertStore.mostrarAlerta('error', validacao)
  }

  try {
    await contribuicaoStore.fetchSegundaVia(cpfCnpjLimpo)

    mostrarSegundaVia.value = true
    cpfCnpj.value = ''
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro: Tente novamente mais tarde!')
  }
}

const baixarSegundaVia = (linha: ContribuicaoSegundaViaInterface) => {
  baixarImagem(linha.url, 'pdf', 'segunda_via')
}

</script>

<style scoped lang="scss">

.segunda-via-container {
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

    .seta {
      cursor: pointer;
      left: 36px;
      top: 36px;
      position: absolute;
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
  }

}

</style>
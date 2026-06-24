<template>
  <div class="container container-configuracao-editar-conteudo">

    <Abas :tabs="abas" v-model="abaAberta" >

      <template #imagens>
        <section-configuracao-editar-conteudo-imagens />
      </template>

      <template #textos>
        <tabela-configuracao-selecao-paragrafo />
      </template>

      <template #endereco-da-instituicao>
          <forms-editar-block
            :formulario="[formularioCEP]"
            @enviarFormulario="salvarCEP"
          />
      </template>

      <template #contatos-da-instituicao>
        <tabela-configuracao-cadastro-da-instituicao />
      </template>

    </Abas>

  </div>
</template>

<script setup lang="ts">

import { cepInstituicao, enviarEndereco } from '~/forms/Configuracao/CepInstituicao';

const cepStore = useCepStore()
const configuracaoEnderecoInstituicaoStore = useConfiguracaoEnderecoInstituicaoStore()
const configuracaoSelecaoParagrafoStore    = useConfiguracaoSelecaoParagrafoStore()
const configuracaoContatoInstituicaoStore  = useConfiguracaoContatoInstituicaoStore()
const configuracaoCampoImagemStore         = useConfiguracaoCampoImagemStore()

const abas = ref([
    'Imagens', 'Textos', 'Endereço da instituição', 'Contatos da instituição'
])
const abaAberta = ref('imagens')
const formularioCEP = ref(cepInstituicao)

const salvarCEP = async () => {
  await enviarEndereco(formularioCEP.value)
}

watch(
  () => cepStore.endereco, (newValue, oldValue) => {
        if(!newValue.erro) {
            preecherFormularioComCep(newValue, [formularioCEP.value])
        }
  }
)

onMounted( async () => {
  if(!configuracaoEnderecoInstituicaoStore.getEndereco) {
    await configuracaoEnderecoInstituicaoStore.fetchEndereco()
    preencherFormulario(configuracaoEnderecoInstituicaoStore.getEndereco, [formularioCEP.value])
  }

  if(!configuracaoSelecaoParagrafoStore.getParagrafos.length) configuracaoSelecaoParagrafoStore.fetchParagrafos()

  if(!configuracaoContatoInstituicaoStore.getContatos.length) configuracaoContatoInstituicaoStore.fetchContatos()

  if(!configuracaoCampoImagemStore.getCampoImagemLogo) configuracaoCampoImagemStore.fetchCampoImagem()
})

</script>

<style scoped lang="scss">

.container-configuracao-editar-conteudo {
  padding-top: 36px
}

</style>
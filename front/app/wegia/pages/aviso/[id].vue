<template>
  <div class="aviso" v-if="!loading">
      <h2>{{ aviso.titulo }}</h2>

      <span
        v-if="aviso.nivel"
        class="status"
        :class="aviso.nivel"
      >
        {{ status[aviso.nivel as keyof typeof status] ?? '' }}
      </span>

      <p>{{ aviso.descricao }}</p>

      <div class="botoes">
        <NuxtLink class="botao botao-saiba-mais" v-if="aviso.url" :to="aviso.url">Saiba mais</NuxtLink>
        <NuxtLink class="botao" to="/">Voltar para o Menu Principal</NuxtLink>
      </div>
  </div>

  <Loading v-else />
</template>


<script setup lang="ts">

const router = useRouter()
const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()
const avisoStore = useAvisoStore()
const alertStore = useAlertStore()

menuSectionStore.setTitulo("Aviso")
const id_aviso: number = Number(router.currentRoute.value.params.id);

const aviso = computed(() => avisoStore.getAviso)

const loading = ref(true)

const status = {
  info: "Informação",
  alerta: "Alerta",
  erro: "Erro"
}

const buscarAviso = async () => {

  const avisoLocal = avisoStore.getAviso
  if(avisoLocal && avisoLocal.id_aviso === id_aviso) return loading.value = false

  await avisoStore.fetchAviso(id_aviso)

}

const iniciar = async () => {
  loading.value = true
  await buscarAviso()
  const avisoLocal = avisoStore.getAviso

  if(avisoLocal.id_pessoa !== pessoaStore.getPessoa?.id_pessoa) {
    alertStore.mostrarAlerta('error', "Você não tem permissão de visualizar aquele aviso")
    return router.push('/aviso')
  }

  loading.value = false
  if(avisoLocal.ativo === 1) avisoStore.fetchAtualizar(id_aviso)

}

iniciar()

</script>

<style scoped lang="scss">

.aviso {
  border-radius: 16px;
  padding: 32px;
  font-family: $font-primary;

  h2 {
    color: $color-quaternary;
    font-family: $font-secondary;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .status {
    border-radius: 999px;
    color: $color-white;
    display: inline-block;
    font-family: $font-tertiary;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 24px;
    padding: 6px 16px;
    text-transform: uppercase;

    &.info {
      background-color: $color-intercurrences;
    }

    &.alerta {
      background-color: $color-warning;
    }

    &.erro {
      background-color: $color-error;
    }
  }

  p {
    color: $color-septenary;
    font-family: $font-tertiary;
    font-size: 1.05rem;
    line-height: 1.8;
    padding-bottom: 24px;
  }

  .botoes {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .botao.botao-saiba-mais {
      background-color: $color-quinary;
      border: 1px solid $color-quinary;
      color: $color-white;

      &:hover {
        background-color: $color-white;
        color: $color-quinary;
        text-decoration: none;
        transition: 0.4s ease-in-out;
      }
    }

    .botao {
      background-color: $color-primary;
      border: 1px solid $color-primary;
      border-radius: 16px;
      color: $color-white;
      font-size: 12px;
      padding: 8px 8px;
      transition: 0.4s ease-in-out;

      &:hover {
        background-color: $color-white;
        color: $color-primary;
        text-decoration: none;
        transition: 0.4s ease-in-out;
      }

      @include sm {
        font-size: 16px
      }
    }
  }

}


</style>



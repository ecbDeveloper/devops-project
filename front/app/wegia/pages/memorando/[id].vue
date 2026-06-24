<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_DESPACHO)">Você não possui permissão!</h2>
  <div v-else>
    <div class="historico-id" v-if="!loading">
      <h2>{{memorando.titulo}}</h2>

      <button @click="mostrar = !mostrar" class="toggle-historico">
        {{ mostrar ? 'Ocultar Histórico' : 'Visualizar Histórico' }}
      </button>

      <transition-group name="fade" tag="div" class="cards-container" v-if="mostrar">
        <CardMemorandoHistorico
          v-for="m in memorando?.despachos"
          :key="m.id_despacho"
          :remetente="m.remetente"
          :destinatario="m.destinatario"
          :texto="m.texto"
          :data="m.data"
          :anexos="m.anexos"
        />
      </transition-group>

      <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_DESPACHO)">Você não possui permissão de despachante!</h2>
      <div v-else>
        <Forms
          v-if="memorandoAparecer"
          :formulario="formulario"
          @enviarFormulario="enviarForm"
        />

        <h2 v-else style="text-align: center">Você não é o destinatario atual do memorando, não é possivel preencher o formulario!</h2>
      </div>

    </div>

    <Loading v-else />
  </div>
</template>

<script setup lang="ts">
import { cadastrarDespacho, enviarCadastrarDespacho } from '@/forms/Memorando/CadastrarDespacho'
import { limparCampos } from '@/utils/FormDataTransform'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.CRIAR_DESPACHO
})

const route = useRoute();
const router = useRouter();
const memorandoStore = useMemorandoStore();
const funcionarioStore = useFuncionarioStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const id = Number(route.params.id);
const mostrar = ref(false);
const loading = ref(true)
const formulario = ref(cadastrarDespacho)

const memorando = computed(() => memorandoStore.getMemorando)

function parseDataBrasileira(str: string): Date {
  const [dia, mes, anoHora] = str.split('/');
  const [ano, hora] = anoHora.split(' ');
  return new Date(`${ano}-${mes}-${dia}T${hora}`);
}

const memorandoAparecer = computed(() => {
  const ultimoDespacho = memorandoStore.getMemorando.despachos.reduce((maisRecente, atual) => {
    return parseDataBrasileira(atual.data) > parseDataBrasileira(maisRecente.data) ? atual : maisRecente;
  });

  mostrar.value = ultimoDespacho.id_destinatario != pessoaStore?.getPessoa?.id_pessoa

  return ultimoDespacho.id_destinatario === pessoaStore?.getPessoa?.id_pessoa
})

const params = {
  permissao: Permissao.CRIAR_DESPACHO
}

const enviarForm = async () => {
  try {
    const data = await enviarCadastrarDespacho(formulario.value, id)

    if(data && data.status == 422) return alertStore.mostrarAlerta('error', 'Verifique os campos enviados!')

    alertStore.mostrarAlerta('success', 'Despacho cadastrado com sucesso!')
    router.push('/memorando')
    limparCampos([formulario.value])

  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao cadastrar despacho')
  }
}

const fetchs = async () => {
  loading.value = true
  await memorandoStore.fetchBuscarPorId(id);
  await funcionarioStore.fetchTodosFuncionarios(params)
  loading.value = false
}

fetchs()
</script>

<style scoped lang="scss">
.historico-id {
  border-radius: 8px;
  padding: 12px;

  @include lg {
    padding: 48px;
  }

  h2 {
    margin-bottom: 24px;
  }

  .toggle-historico {
    background-color: $color-primary;
    border-radius: 5px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 16px;
    padding: 10px 20px;
    transition: background 0.3s;

    &:hover {
      background-color: rgba($color-primary, 0.6);
    }
  }

  .cards-container {
    margin-top: 16px;
  }

  .sem-historico {
    font-style: italic;
    color: #999;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>

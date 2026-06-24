<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_PERMISSAO)">Você não possui permissão!</h2>
  <div class="permissao" v-else>
    <section>
      <InputSelect
        v-model="perfil"
        :storeOpcoes="{
          store: usePerfilStore,
          action: `fetchPerfis`,
          stateProp: 'getPerfisSelect',
          abrirModal: 'toggleModalNovoPerfil'
        }"
        :bloqueado="loading"
        class="input-cargo"
      />

      <Abas v-if="abas" v-model="abaSelecionada" :tabs="abas" />

      <div v-if="formularioDaAba && perfil">
        <Forms
          v-if="!loading"
          :sectionClass="`forms-permissao`"
          :formulario="formularioDaAba"
          :bloqueado="!pessoaStore.possuiPermissao(Permissao.VINCULAR_PERMISSAO)"
          @enviarFormulario="enviarForm"
        />

        <Loading v-else />
      </div>
    </section>
  </div>

  <ModalCadastrarFuncionarioPerfil
    v-if="modalAberto"
    @fechar-modal="perfilStore.toggleModalNovoPerfil"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { permissaoForm } from '~/forms/Configuracao/permissao'
import type { FormularioCompletoInterface } from '~/interface/Formulario/FormularioCompletoInterface'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_PERMISSAO
})

const permissao = ref<FormularioCompletoInterface[]>(permissaoForm)

const menuSectionStore = useMenuSectionStore()
const perfilStore = usePerfilStore()
const permissaoStore = usePermissaoStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

menuSectionStore.setTitulo("Permissão")
menuSectionStore.setComplemento("Páginas / Permissão")

const modalAberto = computed(() => perfilStore.getModalNovoPerfil)

const abas = computed(() => [...new Set(permissaoStore.permissoes.map(p => p.categoria))])

const formularioDaAba = computed(() => permissao.value.find(p => FormatString.slugify(p.titulo) === abaSelecionada.value))

const abaSelecionada = ref<string>('')
const perfil = ref<string | number>("")
const loading = ref<boolean>(false)

const enviarForm = async () => {
  loading.value = true

  const todosIds = permissao.value
  .flatMap(grupo =>
    grupo.itens.flatMap(item =>
      item.value.split(',').filter(v => v !== '').map(Number)
    )
  );

  const body = { permissoes: todosIds }

  try {
    await perfilStore.fetchSincronizarPermissao(Number(perfil.value), body)
    alertStore.mostrarAlerta('success', 'Permissão atualizada com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao atualizar as permissões!')
  }

  loading.value = false
}

watch([perfil], async ([newValue]) => {
  if (newValue === "") {
    return permissao.value.forEach(grupo => {
      grupo.itens.forEach(item => {
        if (item) {
          item.value = ""
        }
      })
    })
  }

  loading.value = true
  await perfilStore.fetchPermissaoPerfil(Number(newValue))

  const idsSelecionados = perfilStore?.perfilPermissao?.permissoes?.map(p => p.id_permissao.toString())

  if(idsSelecionados) {
    permissao.value.forEach(grupo => {
      grupo.itens.forEach(item => {
        const opcoesDaCategoria = item?.opcoes?.map(op => op.value.toString())
        if (opcoesDaCategoria && item) {
          const selecionados = idsSelecionados.filter(id => opcoesDaCategoria.includes(id))
          item.value = selecionados.join(",")
        }
      })
    })

  }

  loading.value = false
})

onMounted(async () => {
  await permissaoStore.fetchPermissao()

  const agrupadas = permissaoStore.permissoes.reduce((acc: Record<string, any[]>, p: any) => {
    const categoria = p.categoria
    if (!acc[categoria]) acc[categoria] = []
    acc[categoria].push({ texto: p.nome, value: p.id_permissao })
    return acc
  }, {})

  permissao.value = Object.keys(agrupadas).map(categoria => ({
    titulo: categoria,
    itens: [
      {
        nome: 'recursos',
        label: 'Permissões',
        type: 'checkbox',
        opcoes: agrupadas[categoria],
        value: "",
        erro: ''
      }
    ]
  }))

  if (permissao.value.length) {
    abaSelecionada.value = FormatString.slugify(permissao.value[0].titulo)
  }

})

</script>

<style lang="scss">
.permissao {
  padding: 12px;

  @include lg {
    padding: 48px;
  }

  .input-cargo {
    width: 250px;
  }

  .forms-permissao {
    .input-checkbox  {
      .input-container {
        align-items: baseline;
        flex-direction: column;
        gap: 16px;

        .checkbox-container {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>

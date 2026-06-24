<template>
        <div class="form-container">

            <InputFileComVisualizacao
                v-model="imagemForm.value"
                :erro="imagemForm.erro"
                :mimeType="imagemForm.mimeType"
            />

            <div class="formularios">
                <Forms
                    :bloqueado="bloqueado"
                    :formulario="formulario"
                    @enviarFormulario="enviar"
                >
                <template #botao v-if="pet">
                    <Butao class="botao" :class="botaoEditar" :texto="botaoEditar" @click-botao="toggleEditar" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_PET)" />
                </template>
                </Forms>

          </div>

      </div>

      <ModalCadastrarBaseCadastroTexto
          v-if="especieModal"
          texto="Cadastrar Especie"
          placeholder="Nome Especie"
          :semPermissao="!pessoaStore.possuiPermissao(Permissao.CRIAR_ESPECIE)"
          @enviar-modal="cadastrarEspecie"
          @fechar-modal="especieStore.setToggleModal"
      />

      <ModalCadastrarBaseCadastroTexto
          v-if="racaModal"
          texto="Cadastrar Raça"
          placeholder="Nome Raça"
          :semPermissao="!pessoaStore.possuiPermissao(Permissao.CRIAR_RACA)"
          @enviar-modal="cadastrarRaca"
          @fechar-modal="racaStore.setToggleModal"
      />
</template>

<script setup lang="ts">

import { cadastrarPet } from '~/forms/pet/cadastrarPet';

const props = defineProps<{
    pet?: PetInterface | null
}>()

const emit = defineEmits(['enviar-form'])

const alertStore = useAlertStore()
const especieStore = useEspecieStore()
const racaStore = useRacaStore()
const pessoaStore = usePessoaStore()

const especieModal = computed(() => especieStore.getModalAberto)
const racaModal = computed(() => racaStore.getModalAberto)

const formulario = reactive(cadastrarPet)
const imagemForm = reactive({ value: null, erro: '', mimeType: 'png|jpg|jpeg' }) as { value: string | File | null, erro: string, mimeType: string }

const bloqueado = ref(false)
const botaoEditar = ref('editar')

const toggleEditar = () => {
    bloqueado.value = !bloqueado.value
    botaoEditar.value = botaoEditar.value === 'editar' ? 'cancelar' : 'editar'
}

const cadastrarEspecie = async (especie: string) => {
  const existe = especieStore.especieExiste(especie)

  if(existe)  {
      alertStore.mostrarAlerta('info', 'Especie ja existe!')
      return
  }

  try {
      await especieStore.fetchCriarEspecie({descricao: especie})
      await especieStore.fetchEspecies()
      alertStore.mostrarAlerta('success', 'Especie Criada com sucesso!')
  } catch (e) {
        console.error('Erro:', e)
      alertStore.mostrarAlerta('error', 'Erro na criacao da especie!')
  }

  especieStore.setToggleModal()
}

const cadastrarRaca = async (especie: string) => {
    const existe = racaStore.racaExiste(especie)

    if(existe)  {
        alertStore.mostrarAlerta('info', 'Raça ja existe!')
        return
    }

    try {
        await racaStore.fetchCriarRaca({descricao: especie})
        await racaStore.fetchRacas()
        alertStore.mostrarAlerta('success', 'Raça Criada com sucesso!')
    } catch (e) {
        console.error('Erro:', e)
        alertStore.mostrarAlerta('error', 'Erro na criacao da raça!')
    }

    racaStore.setToggleModal()
}

const enviar = async () => {
    if(props.pet) bloqueado.value = true

    emit('enviar-form', {formulario, imagemForm})
}

onMounted(() => {
    if(props.pet) {
        bloqueado.value = true
        preencherFormulario(props.pet, [formulario])
        imagemForm.value = props.pet.foto ? props.pet.foto.arquivo_foto_pet : null
    }
})
</script>

<style lang="scss">

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 24px;

        .formularios {
            width: 100%;
        }

        .input-file-com-visualizacao {
            width: 100%;

            @include md {
                width: auto;
            }
        }

        @include md {
            flex-direction: row;
        }
    }

</style>

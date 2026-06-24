<template>

<Modal @fechar-modal="fecharModal" class="modal-socio">

    <BreadCrumbTimeLine
        :steps=etapas
        :currentStep="etapaAtual"
        @navigate="handleStepChange"
    />

    <div class="form-container">

      <div class="formularios">

        <FormsVariasSessoes
            v-if="etapaAtual == 1"
            :formulario="[segundoForm]"
            @enviarFormulario="enviarSegundoFormulario"
        />

        <FormsVariasSessoes
            v-if="etapaAtual == 2"
            :formulario="terceiroForm"
            @enviarFormulario="enviarTerceiroFormulario"
        />

        <FormsVariasSessoes
            v-if="etapaAtual == 3"
            :formulario="[quartoForm]"
            @enviarFormulario="enviarQuartoFormulario"
        />
      </div>

    </div>

</Modal>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { cadastrarPessoaSocio, cadastrarSocio } from '~/forms/Socio/Socio';
import { endereco } from '~/forms/Funcionario/Endereco';

const props = defineProps<{
    socio: SocioInterface | null
}>()

const emit = defineEmits(['fechar-modal', 'buscar'])

const pessoaStore = usePessoaStore()
const socioStore = useSocioStore()
const socioTagStore = useSocioTagStore()
const socioTipoStore = useSocioTipoStore()
const socioStatusStore = useSocioStatusStore()
const cepStore = useCepStore()
const alertStore = useAlertStore()

const etapas = [
    { label: 'Informações pessoais', icon: 'fa-solid fa-user-plus' },
    { label: 'Endereço', icon: 'fas fa-users' },
    { label: 'Informações Sócio', icon: 'fa-solid fa-user-plus' },
]
const etapaAtual = ref(1);

const segundoForm = reactive(cadastrarPessoaSocio)
const terceiroForm = reactive(endereco)
const quartoForm = reactive(cadastrarSocio)


const enviarSegundoFormulario = async () => {

  const validacao = await ValidateForm.validate([segundoForm])

  if(!validacao) return {status: 422, json: {}}


  return etapaAtual.value++

}

const enviarTerceiroFormulario = async () => {

  const validacao = await ValidateForm.validate(terceiroForm)

  if(!validacao) return {status: 422, json: {}}

  etapaAtual.value++
}

const enviarQuartoFormulario = async () => {

  const validacao = await ValidateForm.validate([quartoForm])

  if(!validacao) return {status: 422, json: {}}

  let data = {} as SocioAtualizarInterface

  const dataQuarto = formatFormToJson([quartoForm])

  const { periodicidade, contribuicao, ...resto } = dataQuarto

  const tipo = socioTipoStore.encontrarTipo(periodicidade, contribuicao)

  if(!tipo) {
    alertStore.mostrarAlerta('error', 'Tipo de sócio inválido para a combinação selecionada de periodicidade e contribuição.')
    return;
  }

  data = {
    ...resto,
    id_sociotipo: tipo.id_sociotipo
  }

  try {

    if(!props?.socio) return

    await socioStore.fetchAtualizarSocio(props?.socio.id_socio, props?.socio.pessoa?.id_pessoa, data)

    alertStore.mostrarAlerta('success', 'Socio atualizado com sucesso')
    fecharModal()
    emit('buscar')
  } catch (error) {

    const err = error as FetchError<ErroApiInterface>

    alertStore.mostrarAlerta('error', 'Erro ao cadastrar sócio. Tente novamente mais tarde.')
    return;
  }

}

const handleStepChange = (index: number) => {
    if(index + 1 <= etapaAtual.value) etapaAtual.value = index + 1
}

const fecharModal = () => {
    limparCampos([segundoForm])
    limparCampos(terceiroForm)
    limparCampos([quartoForm])
    pessoaStore.setPessoaPorCpf()
    cepStore.resetEndereco()
    emit('fechar-modal')
}

watch(
  () => cepStore.endereco, (newValue, oldValue) => {
    if(!newValue.erro) {
        preecherFormularioComCep(newValue, terceiroForm)
    }
  }
)

watch(
  quartoForm,
  (novo) => {

    const dataQuarto = formatFormToJson([quartoForm])

    socioTipoStore.setPeriodicidade(dataQuarto.periodicidade || null)

  },
  { deep: true }
)

onMounted(async () => {
  if(!socioTagStore.getTagsFiltros.length) await socioTagStore.fetchTagsFiltro()
  if(!socioTipoStore.getTipos.length) await socioTipoStore.fetchTiposFiltro()
  if(!socioStatusStore.getStatusParaFiltro.length) await socioStatusStore.fetchSocioStatus()


  const tipo = props.socio?.tipo?.tipo?.split(' - ') || null;
  if(props.socio && props.socio?.pessoa.cpf.length > 11) {
    socioTipoStore.setTipoPessoa('Jurídica')
  } else {
    socioTipoStore.setTipoPessoa('Física')
  }
  socioTipoStore.setPeriodicidade(tipo ? tipo[1] : null);


  preencherFormulario(props.socio, [segundoForm]);
  preencherFormulario(props.socio?.pessoa, terceiroForm);
  preencherFormulario(props.socio, [quartoForm]);
  preencherFormulario({
    periodicidade: tipo ? tipo[1] : null
  }, [quartoForm]);
  preencherFormulario({
    contribuicao: tipo ? tipo[2] : null
  }, [quartoForm]);
})

onUnmounted(() => {
  cepStore.resetEndereco()
})

</script>

<style lang="scss">

.modal-socio {
  .modal {
    width: 1240px;
  }
}


</style>
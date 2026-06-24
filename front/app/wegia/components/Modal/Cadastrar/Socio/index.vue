<template>

<Modal @fechar-modal="fecharModal" class="modal-socio">

    <BreadCrumbTimeLine
        :steps=etapas
        :currentStep="etapaAtual"
        @navigate="handleStepChange"
    />

    <div class="form-container">

      <div class="formularios">

        <div v-if="etapaAtual == 1" >
          <InputText v-model="cpfCNPJ" placeholder="Digite o cpf ou cnpj" :mask="Mascara.cpfCnpj" />
          <div class="butoes">
              <Butao texto="Próximo" @click-botao="enviarPrimeiroFormulario" />
          </div>
        </div>

        <FormsVariasSessoes
            v-if="etapaAtual == 2"
            :formulario="[segundoForm]"
            @enviarFormulario="enviarSegundoFormulario"
        />

        <FormsVariasSessoes
            v-if="etapaAtual == 3"
            :formulario="terceiroForm"
            @enviarFormulario="enviarTerceiroFormulario"
        />

        <FormsVariasSessoes
            v-if="etapaAtual == 4"
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

const emit = defineEmits(['fechar-modal', 'buscar'])

const pessoaStore = usePessoaStore()
const socioStore = useSocioStore()
const socioTagStore = useSocioTagStore()
const socioTipoStore = useSocioTipoStore()
const socioStatusStore = useSocioStatusStore()
const cepStore = useCepStore()
const alertStore = useAlertStore()

const etapas = [
    { label: 'Adicionar CPF/CNPJ', icon: 'fa-solid fa-id-card' },
    { label: 'Informações pessoais', icon: 'fa-solid fa-user-plus' },
    { label: 'Endereço', icon: 'fas fa-users' },
    { label: 'Informações Sócio', icon: 'fa-solid fa-user-plus' },
]
const etapaAtual = ref(1);
const cpfCNPJ = ref('')
const pessoaEncontrada = ref<PessoaInterface | null>(null)

const segundoForm = reactive(cadastrarPessoaSocio)
const terceiroForm = reactive(endereco)
const quartoForm = reactive(cadastrarSocio)

const enviarPrimeiroFormulario = async () => {

  pessoaEncontrada.value = null;

  const validacao = ValidateForm.cpfOuCnpjValidacao(cpfCNPJ.value)

  if(validacao.length) return alertStore.mostrarAlerta('error', validacao)

  const cpfCnpjLimpo = cpfCNPJ.value.replace(/\D/g, '');

  if(cpfCNPJ.value.length > 14) {
    socioTipoStore.setTipoPessoa('Jurídica')
  } else {
    socioTipoStore.setTipoPessoa('Física')
  }


  try {

    await pessoaStore.fetchPorCpf(cpfCnpjLimpo)

    pessoaEncontrada.value = pessoaStore.getPessoaPorCpf || null;

    preencherFormulario(pessoaEncontrada.value, [segundoForm]);
    preencherFormulario(pessoaEncontrada.value, terceiroForm);

    preencherFormulario({cpf: cpfCNPJ.value}, [segundoForm]);
    desabilitarCampos([segundoForm])
    desabilitarCampos(terceiroForm)

    alertStore.mostrarAlerta('success', 'Pessoa já cadastrada no sistema.')

    etapaAtual.value = 4

  } catch (error) {
    console.error('Erro ao buscar pessoa por CPF/CNPJ:', error);

    const err = error as FetchError<ErroApiInterface>

    if(err.status === 404) {
      alertStore.mostrarAlerta('success', 'Preencha as informações pessoais')
      preencherFormulario({cpf: cpfCNPJ.value}, [segundoForm]);
      etapaAtual.value = 2
      return;
    }

    return;
  }


}

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

  let data: SocioCadastrarInterface | SocioPessoaCadastrarInterface
  data = {} as SocioCadastrarInterface | SocioPessoaCadastrarInterface

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

    if(pessoaEncontrada.value) {

      (data as SocioCadastrarInterface).id_pessoa = pessoaEncontrada.value.id_pessoa

      await socioStore.fetchCadastrarSocio(data as SocioCadastrarInterface)
    } else {
      const dataTerceiro = formatFormToJson(terceiroForm)
      const dataSegundo = formatFormToJson([segundoForm])

      data = {
        ...data,
        ...dataSegundo,
        ...dataTerceiro
      }


      await socioStore.fetchCadastrarSocioPessoa(data as SocioPessoaCadastrarInterface)
    }


    fecharModal()
    emit('buscar')
  } catch (error) {

    const err = error as FetchError<ErroApiInterface>

    const mensagemExistenteSocio = err.response?._data?.errors?.id_pessoa?.find(
      (msg: string) => msg.includes('Já existe um sócio vinculado')
    );

    if(mensagemExistenteSocio) {
      alertStore.mostrarAlerta('error', 'Já existe um sócio vinculado a essa pessoa.')
      return;
    }

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
  cepStore.resetEndereco()

  if(!socioTagStore.getTagsFiltros.length) await socioTagStore.fetchTagsFiltro()
  if(!socioTipoStore.getTipos.length) await socioTipoStore.fetchTiposFiltro()
  if(!socioStatusStore.getStatusParaFiltro.length) await socioStatusStore.fetchSocioStatus()
})

</script>

<style lang="scss">

.modal-socio {
  .modal {
    width: 1240px;
  }
}


</style>
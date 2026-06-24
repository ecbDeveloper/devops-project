<template>

<Modal @fechar-modal="fecharModal" class="modal-socio">


  <div v-if="cadastroIncompleto" class="cadastro-incompleto">
    <h2>Cpf/Cnpj com cadastro incompleto, entre em contato com a instituição</h2>

    <Butao
      texto="Voltar"
      @click="cadastroIncompleto = false"
    />
  </div>

  <div v-else>
    <BreadCrumbTimeLine
        :steps="etapas"
        :currentStep="etapaAtual"
        @navigate="handleStepChange"
    />

    <div class="form-container">

      <div class="formularios">

        <FormsVariasSessoes
            v-if="etapaAtual == 1"
            textoBotao="Próximo"
            :formulario="[primeiroForm]"
            @enviarFormulario="enviarPrimeiroFormulario"
        />

        <div v-if="etapaAtual == 2" class="segundo-formulario">
          <input-text
            v-model="cpfCnpj"
            label="Digite o CPF/CNPJ"
            :mask="Mascara.cpfCnpj"
          />

          <Butao
            texto="Próximo"
            @click="enviarSegundoFormulario"
          />
        </div>

        <FormsVariasSessoes
            v-if="etapaAtual == 3"
            :formulario="[terceiroForm]"
            @enviarFormulario="enviarTerceiroFormulario"
        />

        <FormsVariasSessoes
            v-if="etapaAtual == 4"
            :formulario="[quartoForm]"
            @enviarFormulario="enviarQuartoFormulario"
        />
      </div>

    </div>
  </div>

</Modal>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'
import { cadastrarPessoaSocio, cadastrarSocioFormExterno } from '~/forms/Socio/Socio';
import { cadastrarValor, cadastrarCarne, cadastrarCartaoCredito } from '~/forms/Contribuicao/Pagamento';
import { enderecoSocio } from '~/forms/Funcionario/Endereco';

const emit = defineEmits(['fechar-modal', 'buscar', 'enviar'])

const props = defineProps<{
  regras: ContribuicaoRegraMeioPagamentoInterface[] | null,
  meioPagamento: ContribuicaoMeioPagamentoAtivoInterface,
  gateway: string,
  periodicidade: string
}>()

const pessoaStore = usePessoaStore()
const socioStore = useSocioStore()
const socioTipoStore = useSocioTipoStore()
const cepStore = useCepStore()
const contribuicaoPagamentoStore = useContribuicaoPagamentoStore()
const alertStore = useAlertStore()

const etapas = [
    { label: 'Valor', icon: 'fa-solid fa-coins' },
    { label: 'Documento', icon: 'fa-regular fa-id-card' },
    { label: 'Informações Pessoais', icon: 'fa-regular fa-user' },
    { label: 'Endereço', icon: 'fa-solid fa-house-user' },
]

const etapaAtual = ref(1);
const cpfCnpj = ref();
const cadastroIncompleto = ref(false)

const primeiroForm = ref<FormularioCompletoInterface>(cadastrarValor)
const segundoForm = reactive(cadastrarPessoaSocio)
const terceiroForm = reactive(cadastrarSocioFormExterno)
const quartoForm = reactive(enderecoSocio)


const validarValorComRegras = (valorDigitado: string): { valido: boolean, mensagem?: string } => {
  if (!props.regras || props.regras.length === 0) {
    return { valido: true }
  }

  if (!valorDigitado || valorDigitado.trim() === '') {
    return { valido: false, mensagem: 'O valor da contribuição é obrigatório.' }
  }

  const valorNumerico = parseFloat(valorDigitado.replace(/[^\d,]/g, '').replace(',', '.'))

  if (isNaN(valorNumerico)) {
    return { valido: false, mensagem: 'Valor inválido' }
  }

  const minValueRegra = props.regras.find(r => r?.regra?.regra === 'MIN_VALUE')
  const maxValueRegra = props.regras.find(r => r?.regra?.regra === 'MAX_VALUE')

  if (minValueRegra) {
    const minValor = parseFloat(minValueRegra.valor)
    if (valorNumerico < minValor) {
      return {
        valido: false,
        mensagem: `O valor mínimo permitido é R$ ${minValor.toFixed(2).replace('.', ',')}`
      }
    }
  }

  if (maxValueRegra) {
    const maxValor = parseFloat(maxValueRegra.valor)
    if (valorNumerico > maxValor) {
      return {
        valido: false,
        mensagem: `O valor máximo permitido é R$ ${maxValor.toFixed(2).replace('.', ',')}`
      }
    }
  }

  return { valido: true }
}

const enviarPrimeiroFormulario = async () => {

  const validacao = await ValidateForm.validate([primeiroForm.value])

  if(!validacao) return {status: 422, json: {}}

  const valorFormulario = formatFormToJson([primeiroForm.value]).valor

  if(!props.regras) return etapaAtual.value++

  const validacaoRegras = validarValorComRegras(valorFormulario)

  if (!validacaoRegras.valido) {
    setErroPorNome(primeiroForm.value, 'valor', validacaoRegras.mensagem || 'Valor inválido')
    return
  }

  etapaAtual.value++
}

const enviarSegundoFormulario = async () => {

  if (!cpfCnpj.value || cpfCnpj.value.trim() === '') return alertStore.mostrarAlerta('error', 'CPF/CNPJ é obrigatório')

  const validacao = ValidateForm.cpfOuCnpjValidacao(cpfCnpj.value)

  if(validacao.length) return alertStore.mostrarAlerta('error', validacao || 'CPF/CNPJ inválido')

  const cpfCnpjLimpo = cpfCnpj.value.replace(/\D/g, '');

  try {
    socioStore.setSocioPublico(null)
    await socioStore.fetchSocioPublico(cpfCnpjLimpo)

    const socioPublico = socioStore.getSocioPublico
    preencherFormulario(socioPublico, [terceiroForm])
    preencherFormulario(socioPublico, [quartoForm])
    desabilitarCampos([terceiroForm])
    desabilitarCampos([quartoForm])

    if(
      !socioPublico?.cep ||
      !socioPublico?.estado ||
      !socioPublico?.cidade ||
      !socioPublico?.bairro ||
      !socioPublico?.numero_endereco ||
      !socioPublico?.complemento
    ) {
      cadastroIncompleto.value = true
      etapaAtual.value = 1
      return;
    }

    if(!socioPublico.email) {
      mudandoCampoNoForm(terceiroForm, 'email', 'desabilitado', false)
    } else {
      if(
        props.meioPagamento?.meio.toLowerCase() === 'cartaocredito' ||
        props.meioPagamento?.meio.toLowerCase() === 'recorrencia'
      ) {
        await envioCartaoCredito()
      }

      emit('enviar', {
        informacoes: formatFormToJson([primeiroForm.value]),
        socio: socioPublico,
        token_cartao: contribuicaoPagamentoStore.getCartaoHash
      })

      alertStore.mostrarAlerta('success', 'Gere seu pagamento na próxima etapa')
      fecharModal()
    }

    return etapaAtual.value = 3

  } catch (error) {
    const err = error as FetchError<ErroApiInterface>

    if(err.status === 404) {
      etapaAtual.value++
      return;
    }
  }
}

const enviarTerceiroFormulario = async () => {

  const validacao = await ValidateForm.validate([terceiroForm])

  if(!validacao) return {status: 422, json: {}}

  etapaAtual.value++
}

const enviarQuartoFormulario = async () => {

  const validacao = await ValidateForm.validate([quartoForm])

  if(!validacao) return {status: 422, json: {}}

  let data = {} as SocioCadastrarInterface

  const dataFormularioTerceiro = formatFormToJson([terceiroForm])
  const dataFormularioQuarto = formatFormToJson([quartoForm])

  try {

    const socioPublico = socioStore.getSocioPublico

    const primeiroFormJson = formatFormToJson([primeiroForm.value])

    const tipoPessoa = cpfCnpj.value.replace(/\D/g, '').length <= 11 ? 'Física' : 'Jurídica'

    socioTipoStore.setTipoPessoa(tipoPessoa)

    let id_socioTipo = socioTipoStore.encontrarTipo(props.periodicidade, props.meioPagamento?.meio)?.id_sociotipo

    if(id_socioTipo === null) {
      id_socioTipo = socioTipoStore.encontrarTipo(props.periodicidade, 'Outros')?.id_sociotipo
    }

    const data = {
      id_sociostatus: 4,
      id_sociotipo: id_socioTipo ?? 1,
      id_sociotag: 1,
      email: dataFormularioTerceiro.email,
      valor_periodo: primeiroFormJson.valor.replace(',', '.'),
      data_referencia: new Date().toISOString().slice(0, 10)
    }

    if(socioPublico) {
      const dataSocio = data as SocioCadastrarInterface
      dataSocio.id_pessoa = socioPublico.id_pessoa

      await socioStore.fetchCadastrarSocio(dataSocio)
    } else {
      let dataSocioPessoa = data as SocioPessoaCadastrarInterface

      dataSocioPessoa = {
        ...dataSocioPessoa,
        ...dataFormularioTerceiro,
        ...dataFormularioQuarto,
        cpf: cpfCnpj.value.replace(/\D/g, '')
      }


      await socioStore.fetchCadastrarSocioPessoa(dataSocioPessoa)
    }

    socioStore.setSocioPublico(null)
    await socioStore.fetchSocioPublico(cpfCnpj.value.replace(/\D/g, ''))

    alertStore.mostrarAlerta('success', 'Socio cadastrado com sucesso')

    if(
      props.meioPagamento?.meio.toLowerCase() === 'cartaocredito' ||
      props.meioPagamento?.meio.toLowerCase() === 'recorrencia'
    ) {
      await envioCartaoCredito()
    }

    emit('enviar', {
      informacoes: primeiroFormJson,
      socio: socioStore.getSocioPublico,
      token_cartao: contribuicaoPagamentoStore.getCartaoHash
    })

    fecharModal()
  } catch (error) {

    const err = error as FetchError<ErroApiInterface>

    alertStore.mostrarAlerta('error', 'Erro ao cadastrar sócio. Tente novamente mais tarde.')
  }

}

const handleStepChange = (index: number) => {
    if(index + 1 <= etapaAtual.value) etapaAtual.value = index + 1
}

const fecharModal = () => {
    limparCampos([primeiroForm.value])
    limparCampos([segundoForm])
    limparCampos([terceiroForm])
    limparCampos([quartoForm])
    pessoaStore.setPessoaPorCpf()
    cepStore.resetEndereco()
    emit('fechar-modal')
}

const envioCartaoCredito = async () => {
  try {
    const primeiroFormJson = formatFormToJson([primeiroForm.value])
    await contribuicaoPagamentoStore.fetchPagamentoNoGatewayPublico(primeiroFormJson, props.gateway)
  } catch (error) {
    alertStore.mostrarAlerta('error', 'Erro ao processar pagamento. Verifique o cartão enviado.')
    throw error;
  }
}

watch(
  () => cepStore.endereco, (newValue, oldValue) => {
    if(!newValue.erro) {
        preecherFormularioComCep(newValue, [quartoForm])
    }
  }
)

onMounted(async () => {

  switch(props.meioPagamento?.meio.toLowerCase()) {
    case 'carne':
      primeiroForm.value = cadastrarCarne
      break;
    case 'cartaocredito':
    case 'recorrencia':
      primeiroForm.value = cadastrarCartaoCredito
      break;
    default:
      primeiroForm.value = cadastrarValor
  }

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

  .cadastro-incompleto {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    h2 {
      text-align: center;
    }

    button {
      align-self: flex-end;
      width: 150px;
    }
  }

  .form-container {

    .formularios {
      margin-top: 20px;

      .primeiro-formulario, .segundo-formulario {
        display: flex;
        flex-direction: column;

        button {
          align-self: flex-end;
          width: 150px;
        }
      }
    }
  }
}


</style>
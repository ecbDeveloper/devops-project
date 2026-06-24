<template>
    <Modal @fechar-modal="fecharModal" class="modal-remuneracao">
        <h2>Adicionar Remuneração</h2>
        <InputSelect 
            v-model="tipo.valor" 
            label="Tipo" 
            :erro="tipo.erro"
            :storeOpcoes="{
                store: useRemuneracaoStore,
                abrirModal: 'setTipoModal',
                action: 'fetchBuscarTipoRemuneracao',
                stateProp: 'getTipoRemuneracaoParaSelect'
            }"
        />

        <InputText 
            v-model="valor.valor" 
            label="Valor"
            placeholder="1000"
            :regex=/\D/g
            :erro="valor.erro"
        />

        <InputText 
            v-model="inicio.valor" 
            label="Data inicio" 
            placeholder="dd/mm/aaaa" 
            mask='##/##/####'
            :regex=/\D/g
            :erro="inicio.erro"
        />        
        
        <InputText 
            v-model="fim.valor" 
            label="Data fim" 
            placeholder="dd/mm/aaaa" 
            mask='##/##/####'
            :regex=/\D/g
            :erro="fim.erro"
        />  

        <div class="butoes">
            <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
            <Butao texto="Ok" @click-botao="enviar" />
        </div>
    </Modal>

    <ModalCadastrarBaseCadastroTexto 
        v-if="baseModal"
        texto="Cadastre um novo tipo de remuneração:"
        @fechar-modal="remuneracaoStore.setTipoModal"
        @enviar-modal="enviarBaseModal"
    />
</template>

<script setup lang="ts">

const emit = defineEmits(['cadastrado'])

const remuneracaoStore = useRemuneracaoStore()
const funcionarioStore = useFuncionarioStore()
const alertStore = useAlertStore()

const baseModal = computed(() => remuneracaoStore.getModalTipoAberto)

const tipo = reactive({valor: 0, erro: ''})
const valor = reactive({valor: '', erro: ''})
const inicio = reactive({valor: '', erro: ''})
const fim = reactive({valor: '', erro: ''})     


const fecharModal = () => {
    remuneracaoStore.setModal()
} 

const enviarBaseModal = (value: String) => {
    if(value == '') return alertStore.mostrarAlerta('error', 'Não é possivel enviar em branco!')

    const json = {descricao: value}

    remuneracaoStore.fetchCadastrarTipoRemuneracao(json).then(() => {
        alertStore.mostrarAlerta('success', 'Tipo da remuneração cadastrado com sucesso!')
        remuneracaoStore.setTipoModal()
    })
}


const enviar = () => {
    limparErro()
    
    const formatarData = [/(^\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1']

    if(tipo.valor == 0) tipo.erro =  'Campo Obrigatorio!'
    if(valor.valor == '') valor.erro =  'Campo Obrigatorio!'
    if(inicio.valor == '') inicio.erro =  'Campo Obrigatorio!'
    if(fim.valor == '') fim.erro =  'Campo Obrigatorio!'

    const [inicio1, inicio2] = formatarData
    const inicioFormatado = inicio.valor.replace(inicio1, inicio2);
    
    const [fim1, fim2] = formatarData
    const fimFormatado = inicio.valor.replace(fim1, fim2);

    if(new Date(inicioFormatado) > new Date(fimFormatado)) {
        inicio.erro = 'Campo deve ser menor que a data fim'
        fim.erro = 'Campo deve ser maior que a data fim'
    }

    const hoje = new Date();

    if(new Date(inicioFormatado) > hoje) inicio.erro = 'Campo deve ser menor que o dia de hoje'
    if(new Date(fimFormatado) > hoje) fim.erro = 'Campo deve ser menor que o dia de hoje'

    if(fim.erro != '' || inicio.erro != '' || valor.erro != '' || tipo.erro != '') return

    const json = {
        funcionario_id_funcionario: funcionarioStore.getFuncionario.id_funcionario,
        funcionario_remuneracao_tipo_idfuncionario_remuneracao_tipo: tipo.valor,
        valor: valor.valor,
        inicio: inicioFormatado,
        fim: fimFormatado
    }

    remuneracaoStore.fetchCadastrarRemuneracao(json).then(() => {
        alertStore.mostrarAlerta('success', 'Remuneracao cadastrada com sucesso!')
        emit('cadastrado')
        fecharModal()
    }).catch(() => {
        alertStore.mostrarAlerta('error', 'Ocorreu um erro no envio!')
    })
}

const limparErro = () => {
    tipo.erro =  ''
    valor.erro =  ''
    inicio.erro =  ''
    fim.erro =  ''
}

</script>

<style scoped lang="scss">

.modal-remuneracao {
    h2 {
        font-size: 20px;
        margin-bottom: 24px;
    }
}

</style>
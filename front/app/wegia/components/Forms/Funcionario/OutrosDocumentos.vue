<template>
    <FormsEditarBlock
        :formulario="formulario"
        @enviarFormulario="enviarFormulario"
        :permissaoEditar=pessoaStore.possuiPermissao(Permissao.ATUALIZAR_FUNCIONARIO)
    />

    <ModalCadastrarSituacao v-if="modalSituacaoAberto" />
    <ModalCadastrarFuncionarioPerfil
        v-if="modalPerfil"
        @fechar-modal="perfilStore.toggleModalNovoPerfil"
    />
</template>

<script setup lang="ts">

import { enviarOutros, outros } from '~/forms/Funcionario/outros';

const props = defineProps({
    id_funcionario: Number
})

const funcionarioStore = useFuncionarioStore()
const situacaoStore = useSituacaoStore()
const perfilStore = usePerfilStore()
const pessoaStore = usePessoaStore()

const funcionario = computed(() => funcionarioStore.getFuncionario)

const modalSituacaoAberto = computed(() => situacaoStore.getModalAberto)
const modalPerfil = computed(() => perfilStore.getModalNovoPerfil)

const formulario = reactive(outros)

const enviarFormulario = () => {
    enviarOutros(formulario, funcionario.value.id_funcionario)
}

onMounted(async () => {
    const funcionarioLocal = funcionarioStore.getFuncionario
    if((!funcionarioLocal || funcionarioLocal.id_funcionario !== props.id_funcionario) && props.id_funcionario) {
        await funcionarioStore.fetchFuncionario(props.id_funcionario)
    }

    const possuiPermissao = pessoaStore.possuiPermissao(Permissao.ATUALIZAR_CARGO_FUNCIONARIO)

    if(possuiPermissao) mudandoCampoNoFormArray(formulario, 'id_perfil', 'desabilitado', false)

    preencherFormulario(funcionarioStore.getFuncionario, formulario)

})

</script>
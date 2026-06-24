<template>
  <Modal @fechar-modal="fecharModal" >
    <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.CRIAR_PERFIL)">Você não possui permissão!</h2>
    <div v-else>
      <p>Novo Perfil</p>
      <div>
        <Forms
          :formulario="formulario"
          @enviarFormulario="enviar"
        />
      </div>
    </div>
  </Modal>

</template>

<script setup lang="ts">

import {cadastrarPerfil, enviarCadastroPerfil} from '@/forms/Funcionario/perfil'

const emit = defineEmits(['enviar-modal', 'fechar-modal'])

const pessoaStore = usePessoaStore()

const formulario = ref(cadastrarPerfil)


const enviar = async () => {
  try {
    await enviarCadastroPerfil(formulario.value)
    fecharModal()
  } catch (e) {
    throw e
  }
}

const fecharModal = () => {
  emit('fechar-modal')
}

</script>

<style lang="scss">

.modal  {
  width: 720px;

  p {
      margin-bottom: 24px;
      font-size: 20px;
  }

  .butoes {
      justify-content: flex-end;
      display: flex;
      gap: 16px;

      button {
          height: 40px;
      }
  }

}

</style>
<template>
  <Modal @fechar-modal="fecharModal" >
      <p >{{ titulo }}</p>
      <InputText v-model="senha" placeholder="senha" />
      <InputText v-model="confirmarSenha" placeholder="Confirmar Senha" />
      <div class="butoes">
          <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
          <Butao texto="Ok" @click-botao="enviar" />
      </div>
  </Modal>
</template>

<script setup lang="ts">

defineProps({
  texto: String,
  placeholder: String,
  titulo: {
    type: String,
    default: "Nova Senha"
  }
})

const emit = defineEmits(['enviar-modal', 'fechar-modal'])

const alertStore = useAlertStore()

const senha = ref('')
const confirmarSenha = ref('')

const enviar = async () => {
  const json = {
    senha: senha.value,
    confirmar_senha: confirmarSenha.value
  }

  if(senha.value !== confirmarSenha.value) {
    return alertStore.mostrarAlerta('error', 'Senhas não coincidem')
  }

  if(senha.value.length < 6) {
    return alertStore.mostrarAlerta('error', 'Senha precisa ter mais de 5 caracteres')
  }

  emit('enviar-modal', json)
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
          width: 30%;
          height: 40px;
      }
  }

}

</style>
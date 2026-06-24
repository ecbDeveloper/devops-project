<template>
    <Modal @fechar-modal="fecharModal">
        <p>Tem certeza que deseja excluir este item?</p>
        
        <div class="butoes">
            <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
            <Butao texto="Excluir" :class="'danger'" @click-botao="confirmarExclusao" />
        </div>
    </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits(['confirmar', 'fechar-modal'])


const confirmarExclusao = async () => {
    emit('confirmar')
}

const fecharModal = () => {
    emit('fechar-modal')
}
</script>

<style scoped lang="scss">
.modal  {
    width: 480px;

    p {
        margin-bottom: 24px;
        font-size: 18px;
        text-align: center;
    }
    
    .butoes {
        justify-content: center;
        display: flex;
        gap: 16px;
        
        button {
            width: 30%;
            height: 40px;
        }
    }
}
</style>

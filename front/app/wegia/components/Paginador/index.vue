<template>
    <div class="paginador">
      <button 
        v-if="paginaAtual > 1" 
        @click="atualizarPagina(paginaAtual - 1)" 
        class="paginador-btn anterior"
      >
        ‹
      </button>
  
      <div 
        v-for="(pagina, index) in paginador" 
        :key="index" 
        :class="['paginador-btn', { active: pagina === paginaAtual }]"
        @click="atualizarPagina(pagina)"
      >
        {{ pagina }}
      </div>
  
      <button 
        v-if="paginaAtual < ultimaPagina" 
        @click="atualizarPagina(paginaAtual + 1)" 
        class="paginador-btn proximo"
      >
        ›
      </button>
    </div>
  </template>
  
<script setup lang="ts">
  
const props = defineProps({
    paginaAtual: {
      type: Number,
      required: true
    },
    ultimaPagina: {
      type: Number,
      required: true
    }
});
  
const emit = defineEmits(['atualizar-pagina']);

  
const atualizarPagina = (pagina: number) => {
    if (pagina > 0 && pagina <= props.ultimaPagina) {
        emit('atualizar-pagina', pagina);
    }
};
  
const paginador = computed(() => {
    const numeros: number[] = [];
    let inicio = Math.max(props.paginaAtual - 2, 1);
    let fim = Math.min(props.paginaAtual + 2, props.ultimaPagina);
  
    for (let i = inicio; i <= fim; i++) {
      numeros.push(i);
    }
  
    return numeros;
});
</script>
  
<style scoped lang="scss">
.paginador {
    align-items: center;
    display: flex;
    gap: 10px;
    justify-content: center;

    .paginador-btn {
        background-color: $color-tertiary;
        border-radius: 4px;
        cursor: pointer;
        padding: 8px 16px;
        transition: background-color 0.2s, color 0.2s;
    
        &.active {
            background-color: $color-primary;
            color: $color-white;
        }
    
        &:hover {
            background-color: $color-secondary;
        }
        
        &.anterior,
        &.proximo {
            font-size: 16px;
        }
        
        &.anterior:hover,
        &.proximo:hover {
            background-color: $color-secondary;
        }
    }

}
  
  
</style>
  
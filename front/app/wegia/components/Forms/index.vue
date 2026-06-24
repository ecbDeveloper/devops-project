<template>

  <SectionSimplesForm :titulo=titulo :bloqueado="bloqueado" :textoBotao="textoBotao" @enviar-formulario="enviar" class="forms">
      <section :class="sectionClass">
          <template v-for="(item, index2) in formulario.itens" :key="index2">
            <Input
              v-if="!item.invisivel"
              :placeholder="item.placeholder"
              :mask="item.mask"
              :regex="item.regex"
              :erro="item.erro"
              :type="item.type"
              :label="item.label"
              :opcoes="item.opcoes"
              :storeOpcoes="item.storeOpcoes"
              :desabilitado="item.desabilitado || bloqueado"
              :obrigatorio="item.obrigatorio"
              v-model="item.value"
            />
          </template>

          <slot name="form-manual" />
      </section>
      <template #botao>
          <slot name="botao" />
      </template>
  </SectionSimplesForm>

  </template>

<script setup lang="ts">

  import type { FormularioInterface } from '~/interface/Formulario/FormularioInterface';

defineProps({
  formulario: {
    type: Object as PropType<{ titulo: string; itens: FormularioInterface[] }>,
    required: true
  },
  textoBotao: {
    type: String,
    default: 'Enviar'
  },
  titulo: String,
  sectionClass: String,
  bloqueado: Boolean
})

  const emit = defineEmits(['enviarFormulario']);

  const enviar = () => {
      emit('enviarFormulario')
  }

 </script>

  <style scoped lang="scss">

  .forms {

      section {
          border-top: 1px dotted $color-secondary;
          padding-top: 24px;

          &:first-child {
              border-top: none;
              padding: 0px;
          }

          h2 {
              color: $color-octonary;
              font-weight: 500;
              margin-bottom: 16px;
          }
      }

  }

  </style>
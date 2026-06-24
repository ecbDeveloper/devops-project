<template>
    <div class="input-file-com-visualizacao">
      <div class="preview">
        <img v-if="modelValue" :src=previewSrc alt="arquivo escolhido">
        <img v-else src='@/assets/img/sem_foto.png' alt="arquivo escolhido">
      </div>

      <input
        type="file"
        ref="fileInput"
        id="fileInput"
        class="hidden-input"
        :accept="mimeTypes"
        :disabled="semPermissao"
        @change="previewImage"
      />

      <p class="erro" v-if="erro">{{ erro }}</p>

      <label for="fileInput" v-if="!semPermissao">Escolher Foto</label>

      <slot name="embaixoImagem" ></slot>
    </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  modelValue: File | string | null
  erro?: string
  mimeType?: string
  semPermissao?: boolean
}>(), {
  semPermissao: false
})

const emit = defineEmits(['update:modelValue'])

const mimeTypes = computed(() => {
    if(props.mimeType) return props.mimeType.split('|').map(type => `image/${type}`).join(',')
    return ''
})

const previewSrc = computed(() => {
  if (props.modelValue instanceof File) {
    return URL.createObjectURL(props.modelValue)
  }

  if (typeof props.modelValue === 'string' && props.modelValue.length > 0) {
    return props.modelValue
  }

})

const previewImage = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
        emit('update:modelValue', file)
    }
}

</script>

<style scoped lang="scss">

.input-file-com-visualizacao {
    align-items: center;
    background-color: $color-white;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    gap: 15px;
    height: 100%;
    padding: 24px;
    width: 250px;

    .hidden-input {
        display: none;
    }

    .preview {
        width: 150px;
        height: 150px;
        border: 2px dashed #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .erro {
        color: $color-error;
        font-size: 14px;
    }

    label {
        color: $color-white;
        background: $color-primary;
        border-radius: 8px;
        cursor: pointer;
        padding: 8px;

        &:hover {
            background: $color-primary-opacity;
        }
    }
}

</style>

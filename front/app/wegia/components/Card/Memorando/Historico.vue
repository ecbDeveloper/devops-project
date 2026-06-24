<template>
  <div class="card-historico">
    <div class="cabecalho">
      <p><strong>Remetente:</strong> {{ remetente }}</p>
      <p><strong>Destinatário:</strong> {{ destinatario }}</p>
    </div>

    <div class="corpo">
      <p>{{ texto }}</p>

      <div v-if="anexos.length" class="anexos">
        <p><strong>Anexos:</strong></p>
        <ul>
          <li v-for="(anexo, index) in anexos" :key="index">
            <span>{{ anexo.nome }}</span>
            <div>
              <button @click="abrirModal(anexo)" class="btn">Visualizar</button>
              <button @click="baixar(anexo)" class="btn">Baixar</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="rodape">
      <small>{{ data }}</small>
    </div>

    <Modal v-if="mostrarModal" @fecharModal="mostrarModal = false">
      <img :src="imagemModal" alt="Anexo" class="modal-imagem" />
    </Modal>

  </div>
</template>


<script setup lang="ts">

import { baixarImagem } from '@/utils/imagem'
import type { AnexoInterface } from '@/interface/Memorando/Anexo/AnexoInterface'

defineProps<{
  remetente: string,
  destinatario: string,
  texto: string,
  data: string,
  anexos: AnexoInterface[]
}>()

const mostrarModal = ref(false)
const imagemModal = ref('')

const abrirModal = (anexo: AnexoInterface) => {
  imagemModal.value = anexo.anexo
  mostrarModal.value = true
}

const baixar = (anexo: AnexoInterface) => {
  baixarImagem(anexo.anexo, anexo.extensao, anexo.nome)
}

</script>

<style scoped lang="scss">

.card-historico {
    padding: 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;

    .cabecalho {
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }

    .corpo {
      color: #444;
      margin: 0 0 8px 0;
    }

    .rodape {
      font-size: 0.9rem;
      color: #777;
      text-align: right;
    }

    .anexos {
      margin-top: 10px;

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;

          @include md {
            flex-direction: row;
          }

          div {
            display: flex;
            flex-direction: row;
            gap: 16px;

            .btn {
              background-color: $color-quinary;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.2s;

              &:hover {
                background-color: rgba($color-quinary, 0.5);
              }
            }
          }

        }
      }
    }

    .modal-imagem {
      height: 100%;
      margin-top: 24px;
      width: 100%;

      @include sm {
        height: 500px;
        width: 500px;
      }
    }
}

</style>
<template>
  <div class="tabela-wrapper">
    <table class="tabela" v-if="linhas?.length">
      <thead>
        <tr>
          <th
            v-for="cabecalho in cabecalhos"
            :key="cabecalho.chave"
            @click="(cabecalho.ordenavel ?? true) && cabecalho.chave !== 'acao' && ordernar(cabecalho.chave)"
            :class="{ sortable: cabecalho.ordenavel && cabecalho.chave !== 'acao' }"
          >
            <div class="cabecalho" v-if="cabecalho.chave !== 'acao' || acao?.length">
              {{ cabecalho.nome }}
              <span class="ordenador-icones" v-if="cabecalho.ordenavel && cabecalho.chave !== 'acao'">
                <span
                  class="seta up"
                  :class="{ active: orderBy === cabecalho.chave && tipoOrderBy === 'ASC', hidden: orderBy === cabecalho.chave && tipoOrderBy !== 'ASC' }"
                >▲</span>
                <span
                  class="seta down"
                  :class="{ active: orderBy === cabecalho.chave && tipoOrderBy === 'DESC', hidden: orderBy === cabecalho.chave && tipoOrderBy !== 'DESC' }"
                >▼</span>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(linha, index) in linhas"
          :key="index"
          @click="clickLinha(linha)"
          class="linha desktop-linha"
        >
          <td v-for="cabecalho in cabecalhos" :key="cabecalho.chave">
            <div v-if="cabecalho.chave === 'acao'" class="icones">
              <slot name="acao" :linha="linha" />
              <i v-if="acao?.includes('editar')" class="fas fa-edit" @click.stop="editar(linha)"></i>
              <i v-if="acao?.includes('baixar')" class="fas fa-download" @click.stop="baixar(linha)"></i>
              <i v-if="acao?.includes('deletar')" class="fas fa-trash" @click.stop="toggleModalExcluir(linha)"></i>
            </div>
            <template v-else>
              <slot :name="cabecalho.chave" :linha="linha">
                <span :title="linha[cabecalho.chave]">{{ linha[cabecalho.chave] }}</span>
              </slot>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="cards" v-if="linhas?.length">
      <div v-for="(linha, index) in linhas" :key="index" class="card" @click="clickLinha(linha)">
        <div v-for="cabecalho in cabecalhos" :key="cabecalho.chave" class="card-row">
          <strong>{{ cabecalho.nome }}:</strong>
          <span v-if="cabecalho.chave !== 'acao'" :title="linha[cabecalho.chave]">
            <slot :name="cabecalho.chave" :linha="linha">{{ linha[cabecalho.chave] }}</slot>
          </span>
          <div v-else class="icones">
            <slot name="acao" :linha="linha" />
            <i v-if="acao?.includes('editar')" class="fas fa-edit" @click.stop="editar(linha)"></i>
            <i v-if="acao?.includes('baixar')" class="fas fa-download" @click.stop="baixar(linha)"></i>
            <i v-if="acao?.includes('deletar')" class="fas fa-trash" @click.stop="toggleModalExcluir(linha)"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="sem-corpo" v-else>
      <p>Ainda não possui registros cadastrados.</p>
    </div>

    <ModalConfirmarExclusao
      v-if="modalExcluirAberto"
      @fechar-modal="toggleModalExcluir(null)"
      @confirmar="excluir"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  cabecalhos: Array as PropType<{ nome: string, chave: string, ordenavel: boolean }[]>,
  linhas: Array,
  orderBy: String,
  tipoOrderBy: String,
  acao: Array
});

const emit = defineEmits(['atualizar-orderBy', 'click-linha', 'excluir', 'baixar', 'editar']);

const modalExcluirAberto = ref(false)
const linhaASerExcluida = ref(null)

const clickLinha = (value: Object) => emit('click-linha', value)
const toggleModalExcluir = (linha: any) => {
  linhaASerExcluida.value = linha
  modalExcluirAberto.value = !modalExcluirAberto.value
}
const excluir = () => { emit('excluir', linhaASerExcluida.value); modalExcluirAberto.value = false }
const editar = (linha: any) => emit('editar', linha)
const baixar = (linha: any) => emit('baixar', linha)

const ordernar = (chave: string) => {
  if(chave === 'acao') return
  if (props.orderBy === chave) {
    const tipo = props.tipoOrderBy === 'ASC' ? 'DESC' : 'ASC'
    emit('atualizar-orderBy', { orderBy: chave, tipoOrderBy: tipo })
    return
  }
  emit('atualizar-orderBy', { orderBy: chave, tipoOrderBy: 'ASC' })
}
</script>

<style scoped lang="scss">
.tabela-wrapper {
  width: 100%;
  overflow-x: auto;

  .tabela {
    border-collapse: collapse;
    display: none;
    min-width: max-content;
    width: 100%;

    @include lg {
      display: table;
    }
  }

  th, td {
    border-bottom: 1px solid #ddd;
    min-width: 150px;
    overflow: hidden;
    padding: 12px 16px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  thead th {
    background-color: $color-primary;
    color: $color-white;
    font-weight: bold;
    position: sticky;
    top: 0;

    .cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ordenador-icones {
        display: inline-flex;
        flex-direction: column;
        margin-left: 4px;

        .seta {
          font-size: 12px;
          color: #bbb;
        }

        .seta.active {
          color: $color-white;
        }

        .seta.hidden {
          visibility: hidden;
        }
      }
    }

    &.sortable {
      cursor: pointer;
    }
  }

  .linha {
    cursor: pointer;
    &:hover {
      background-color: $color-quinary;
      color: $color-white;
   }
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 16px;

    @include lg {
      display: none;
    }

    .card {
      background-color: $color-white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .card-row {
        align-items: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;

        @include sm {
          justify-content: space-between;
          flex-direction: row;
        }

        strong {
          margin-right: 8px;
        }

      }
    }
  }

  .icones {
    display:
    flex; gap: 8px;

    .fa-download, .fa-edit {
      background-color: $color-primary;
      border-radius: 8px;
      color: $color-white;
      padding: 12px;
    }

    .fa-trash {
      background-color: $color-error;
      border-radius: 8px;
      color: $color-white;
      padding: 12px;
    }
  }

  .sem-corpo {
    background-color: $color-white;
    padding: 24px;

    p {
      margin: auto;
      width: fit-content;
    }
  }
}
</style>

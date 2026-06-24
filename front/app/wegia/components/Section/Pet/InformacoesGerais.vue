<template>
  <div class="saude-informacoes-gerais">
    <div class="card">
      <div class="cabecalho">
        <h2 class="titulo">Informações Pessoais</h2>
        <button class="toggle" @click="mostrar = !mostrar">
          <i :class="mostrar ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
        </button>
      </div>

      <transition name="slide-up">
        <div v-show="mostrar" class="informacoes-paciente">
          <div class="linha">
            <span class="label">Nome:</span>
            <span class="valor">{{ ficha?.pessoa?.nome }}</span>
          </div>
          <div class="linha">
            <span class="label">Sexo:</span>
            <span class="valor">{{ sexo }}</span>
          </div>
          <div class="linha">
            <span class="label">Data de Nascimento:</span>
            <span class="valor">
              {{ ficha?.pessoa?.data_nascimento ?? 'Não cadastrado' }}
              <span v-if="idade"> ({{ idade }} anos)</span>
            </span>
          </div>
          <div class="linha">
            <span class="label">Tipo Sanguíneo:</span>
            <span class="valor">{{ ficha?.pessoa?.tipo_sanguineo || 'Não cadastrado' }}</span>
          </div>
          <div class="linha" v-if="ficha?.pessoa?.arquivos?.length">
            <div
              class="download"
              v-for="arquivo in ficha?.pessoa?.arquivos"
              @click="baixarImagem(arquivo.arquivo, arquivo.extensao_arquivo, arquivo.nome_arquivo)"
            >
              {{ arquivo?.tipo?.descricao ?? '' }}
              <i class="fas fa-download"></i>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="prontuario-sessoa">
      <h5>Prontuário Público</h5>

      <InputTextArea
        v-model="prontuario"
        :rows="6"
        :bloqueado="bloqueado"
      />

      <div class="botoes" v-if="bloqueado">
        <Butao class="botao-editar" texto="Editar Prontuário" @click="toggleBloqueado" v-if="pessoaStore.possuiPermissao(Permissao.ATUALIZAR_FICHA_MEDICA)" />

        <div>
          <Butao class="botao-adicionar-versao" texto="Adicionar versão ao histórico" @click="salvarProntuarioHistorico" v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_HISTORICO_PRONTUARIO)" />
          <span @click="toggleModalAberto">Listar versões</span>
        </div>
      </div>

      <div class="botoes" v-else>
        <div >
            <Butao class="botao-editar" classExtra="sucesso" texto="Salvar" @click="salvarProntuario" />
            <Butao class="botao-editar" classExtra="erro" texto="Cancelar" @click="cancelarProntuario" />
        </div>
      </div>
    </div>
  </div>

  <modal-saude-historico-prontuario
    v-if="modalAberto"
    :historico="ficha?.historico || []"
    @fechar-modal="toggleModalAberto"
  />

</template>

<script setup lang="ts">

const props = defineProps<{
  ficha: SaudeFichaMedicaInterface
}>();

const emit = defineEmits<{
  (e: 'buscar-ficha'): void
}>();

const saudeFichaMedicaStore = useSaudeFichaMedicaStore();
const pessoaStore = usePessoaStore();
const alertStore = useAlertStore();

const mostrar = ref(true);
const bloqueado = ref(true);
const modalAberto = ref(false);
const prontuario = ref(props.ficha?.prontuario || '');

const idade = computed(() =>{
  const [dia, mes, ano] = props.ficha.pessoa?.data_nascimento?.split('/').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesDif = hoje.getMonth() - nascimento.getMonth();
  const diaDif = hoje.getDate() - nascimento.getDate();

  if (mesDif < 0 || (mesDif === 0 && diaDif < 0)) {
    idade--;
  }

  return idade;
})

const sexo = computed(() => {
  const s = {
    M: 'Masculino',
    m: 'Masculino',
    F: 'Feminino',
    f: 'Feminino',
  }

  const valor = props.ficha?.pessoa?.sexo ?? ''

  return s[valor as keyof typeof s] ?? 'Não cadastrado'
})

const toggleBloqueado = () => { bloqueado.value = !bloqueado.value; }
const toggleModalAberto = () => { modalAberto.value = !modalAberto.value; }

const salvarProntuario = async () => {
  try {
    await saudeFichaMedicaStore.atualizarProntuario(props.ficha.id_fichamedica, { prontuario: prontuario.value });
    alertStore.mostrarAlerta('success', 'Prontuário atualizado com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('success', 'Erro ao atualizar o prontuário!')
  }

  toggleBloqueado()
};

const salvarProntuarioHistorico = async () => {
  try {
    await saudeFichaMedicaStore.adicionarProntuarioHistorico(props.ficha.id_fichamedica);
    alertStore.mostrarAlerta('success', 'Versão do prontuário adicionada com sucesso!')
    emit('buscar-ficha')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao adicionar a versão do prontuário!')
  }
};

const cancelarProntuario = () => {
  prontuario.value = props.ficha?.prontuario || '';
  toggleBloqueado()
};

</script>

<style scoped lang="scss">

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: max-height 1s ease, opacity 1s ease, transform 1s ease;
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  .slide-up-enter-to,
  .slide-up-leave-from {
    max-height: 500px;
    opacity: 1;
    transform: translateY(0);
  }

.saude-informacoes-gerais {
  font-family: $font-primary;
  padding: 1rem;

  .card {
    background-color: $color-white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .cabecalho {
    align-items: center;
    display: flex;
    position: relative;
    justify-content: space-between;
  }

  .titulo {
    color: $color-primary;
    font-family: $font-secondary;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    border-bottom: 1px solid $color-secondary;
    padding-bottom: 0.5rem;
    padding-right: 1.3rem;
    flex: 1;

    @include sm {
      font-size: 1.5rem;
    }
  }

  .toggle {
    background: $color-primary;
    border-radius: 6px;
    border: none;
    color: $color-white;
    cursor: pointer;
    font-size: .8rem;
    font-weight: bold;
    height: 24px;
    position: absolute;
    right: 0px;
    top: 4px;
    transition: background 0.3s;
    width: 24px;

    @include sm {
      font-size: 1.2rem;
      height: 32px;
      width: 32px;
    }

    &:hover {
      background: $color-primary-opacity;
    }
  }

  .informacoes-paciente {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .linha {
    border-radius: 8px;
    display: flex;
    gap: 0.5rem;
    padding: 0.6rem 0.8rem;

    .download {
      align-items: center;
      background-color: $color-primary;
      border-radius: 8px;
      color: $color-white;
      cursor: pointer;
      display: flex;
      gap: 8px;
      padding: 8px;
    }
  }

  .label {
    font-weight: 600;
    color: $color-quaternary;
    font-family: $font-tertiary;
  }

  .valor {
    color: $color-quinary;
    font-family: $font-tertiary;
  }

  .prontuario-sessoa {
    margin-top: 1.5rem;

    h5 {
      margin-bottom: 0.5rem;
      padding-bottom: 0.3rem;
      padding-right: 1.3rem;
    }

    .botoes {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      div {
        display: flex;
        gap: 0.8rem;

        .botao-adicionar-versao {
          background-color: $color-secondary;
          border-radius: 8px;
          color: $color-white;
          font-weight: 600;
          padding: 0 1.2rem;
          transition: background-color 0.3s, color 0.3s, opacity 0.3s;
          width: auto;

          &:hover {
            background-color: $color-secondary;
            color: $color-black;
            opacity: 0.5;
          }
        }

        span {
          color: $color-primary;
          cursor: pointer;
          display: flex;
          font-weight: 600;
          padding: 0 1.2rem;
          text-decoration: none;
          transition: color 0.3s;

          &:hover {
            color: $color-black;
          }
        }
      }

      .botao-editar {
        margin-top: 0.8rem;
        width: 150px;
      }

    }

  }
}
</style>

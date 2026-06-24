<template>
    <header>
      <img :src="logoSrc" alt="Logo do wegia" class="logo" />

      <div class="dados" v-if="pessoa">
        <div class="notificacoes" ref="dropdownRef">
          <div class="notificacoes-botao" @click="toggleDropdown">
            <span class="intercorrencias">Avisos</span>
            <i class="fa fa-bell"></i>
            <span v-if="pessoa.avisos && pessoa?.avisos?.length > 0" class="quantiade">
              {{ pessoa?.avisos?.length <= 9 ? pessoa?.avisos?.length : '+9' }}
            </span>
          </div>

          <div class="dropdown" v-if="mostrarDropdown">
            <transition-group
              name="fade-slide"
              tag="div"
              class="avisos-lista"
              v-if="pessoa?.avisos && pessoa?.avisos.length > 0"
            >
              <NuxtLink
                v-for="(aviso, index) in pessoa.avisos"
                @click="toggleDropdown"
                :key="aviso.id_aviso"
                :class="aviso.nivel"
                :to="`/aviso/${aviso.id_aviso}`"
                class="aviso"
              >
                <button class="fechar-aviso" @click.stop="removerAviso(aviso)">×</button>
                <span class="titulo">
                  {{ aviso.titulo.length > 20 ? aviso.titulo.slice(0, 20) + '...' : aviso.titulo }}
                </span>
                <span class="descricao">
                  {{ aviso.descricao.length > 35 ? aviso.descricao.slice(0, 35) + '...' : aviso.descricao }}
                </span>
              </NuxtLink>
            </transition-group>

            <span class="sem-notificacao" v-else>Você não possui notificação</span>

            <div class="mostrar-todos">
              <NuxtLink @click="toggleDropdown" to="/aviso">Mostrar todos</NuxtLink>
            </div>
          </div>
        </div>

        <div class="perfil" @click="toggleDropdownPerfil" ref="dropdownPerfilRef" v-if="pessoa?.nome">
          <img src="@/assets/img/sem_foto.png" alt="Foto de perfil" />
          <div >
            <span class="nome">{{ pessoa.nome }}</span>
            <span class="cargo">{{ pessoa?.funcionario?.perfil?.cargo ?? "Sem cargo" }}</span>
          </div>
          <i class="fas fa-chevron-down"></i>
        </div>

        <div class="dropdown-perfil" v-if="mostrarDropdownPerfil">
          <div @click="toggleModal" class="item-perfil">
            <i class="fas fa-key"></i>
            <span>Trocar Senha</span>
          </div>
          <div @click="authStore.fetchSair" class="item-perfil">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </div>
        </div>
      </div>
    </header>

    <ModalAtualizarPessoaSenha v-if="mostrarModal" @fechar-modal="toggleModal" @enviar-modal="trocarSenha" />
</template>

<script setup lang="ts">

import type { AvisoInterface } from '@/interface/Pessoa/Aviso/AvisoInterface'
import type { PessoaAtualizarSenhaInterface } from "~/interface/Pessoa/PessoaAtualizarSenhaInterface"

const pessoaStore                  = usePessoaStore()
const authStore                    = useAuthStore()
const avisoStore                   = useAvisoStore()
const alertStore                   = useAlertStore()
const configuracaoCampoImagemStore = useConfiguracaoCampoImagemStore()

const pessoa = computed(() => pessoaStore.getPessoa)

const dropdownRef = ref<HTMLElement | null>(null)
const dropdownPerfilRef = ref<HTMLElement | null>(null)

const mostrarDropdown = ref(false)
const mostrarDropdownPerfil = ref(false)
const mostrarModal = ref(false)

const logoSrc = computed(() => configuracaoCampoImagemStore.getCampoImagemLogoUrl)

const toggleDropdown = () => {
  mostrarDropdown.value = !mostrarDropdown.value
}

const toggleDropdownPerfil = () => {
  mostrarDropdownPerfil.value = !mostrarDropdownPerfil.value
}

const toggleModal = () => {
    mostrarModal.value = !mostrarModal.value
    mostrarDropdown.value = false
    mostrarDropdownPerfil.value = false
}

const removerAviso = async (aviso: AvisoInterface) => {
  try {
    await avisoStore.fetchAtualizar(aviso.id_aviso)
    pessoaStore.removerAviso(aviso.id_aviso)
    alertStore.mostrarAlerta('info', 'Aviso Ocultado!')
  } catch (e) {
    console.log(e)
  }
}

const trocarSenha = async (body: PessoaAtualizarSenhaInterface) => {
    try {
        await pessoaStore.fetchAtualizarPropriaSenha(body);
        alertStore.mostrarAlerta('success', 'Senha alterada!')
        toggleModal()
    } catch (e) {
        console.error('Erro:', e)
        alertStore.mostrarAlerta('error', 'Erro ao alterar as senhas!')
    }
}

const clicouFora = (event: MouseEvent) => {
  const target = event.target as Node

  if (mostrarDropdown.value && dropdownRef.value && !dropdownRef.value.contains(target)) {
    mostrarDropdown.value = false
  }

  if (mostrarDropdownPerfil.value && dropdownPerfilRef.value && !dropdownPerfilRef.value.contains(target)) {
    mostrarDropdownPerfil.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', clicouFora)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clicouFora)
})

</script>

<style scoped lang="scss">

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

header {
  align-items: center;
  display: flex;
  height: 72px;
  justify-content: space-between;
  padding: 0 24px;
  width: 100%;

  .logo {
    height: 35px;
    width: 52px;

    @include sm {
      height: 50px;
      width: 72px;
    }
  }

  .dados {
    align-items: center;
    display: flex;
    gap: 36px;

    .notificacoes {
      align-items: center;
      color: $color-primary;
      cursor: pointer;
      display: flex;
      gap: 8px;
      position: relative;

      .notificacoes-botao {
        align-items: center;
        display: flex;
        gap: 8px;

        .quantiade {
          align-items: center;
          background: rgba($color-warning, 0.8);
          border-radius: 50%;
          color: $color-white;
          display: flex;
          font-size: 0.75rem;
          height: 16px;
          justify-content: center;
          position: absolute;
          right: -10px;
          top: 12px;
          width: 16px;
        }
      }

      .intercorrencias {
        display: none;

        @include md {
          display: block;
        }
      }
    }

    .perfil {
      align-items: center;
      display: flex;
      cursor: pointer;

      img {
        height: 46px;
        width: 46px;
        margin-right: 8px;
      }

      & > div {
        @include sm {
          margin-right: 42px;
        }

        .nome {
          font-size: 13px;
          line-height: 16px;
        }

        .cargo {
          color: $color-senary;
        }

        span {
          display: block;
          font-size: 11px;
        }
      }

      i {
        display: none;

        @include sm {
          display: block;
        }
      }
    }

    .dropdown-perfil {
        background: $color-white;
        border: 1px solid $color-secondary;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 60px;
        right: 0;
        width: 180px;
        z-index: 999;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

        .item-perfil {
            align-items: center;
            color: $color-primary;
            cursor: pointer;
            display: flex;
            font-size: 14px;
            gap: 10px;
            padding: 12px 16px;
            text-decoration: none;
            transition: background 0.2s;

            &:hover {
                background: $color-tertiary;
            }

            i {
                width: 16px;
            }
        }
    }
  }

  .dropdown {
    background: $color-white;
    border: 1px solid $color-secondary;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow: hidden;
    position: absolute;
    top: 60px;
    right: -190px;
    width: 300px;
    z-index: 999;

    @include sm {
      right: 0;
    }

    .avisos-lista {
      flex: 1;
      overflow-y: auto;
      padding: 10px;

      .aviso {
        border-bottom: 1px solid $color-secondary;
        cursor: pointer;
        display: block;
        padding: 12px;
        position: relative;
        text-decoration: none;
        width: 100%;

        &:hover {
          background: $color-tertiary;
        }

        .fechar-aviso {
          background: transparent;
          border: none;
          color: $color-senary;
          cursor: pointer;
          font-size: 14px;
          position: absolute;
          right: 10px;
          top: 8px;

          &:hover {
            color: $color-black;
          }
        }

        .titulo {
          display: block;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .descricao {
          color: $color-octonary;
          font-size: 12px;
        }
      }

        .info {
            border-left: 5px solid $color-intercurrences;
        }

        .erro {
            border-left: 5px solid $color-error;
        }

        .alerta {
            border-left: 5px solid $color-warning;
        }
    }

    .mostrar-todos {
        background-color: $color-tenth;
        border-top: 1px solid $color-secondary;
        flex-shrink: 0;
        padding: 10px;
        text-align: center;

        a {
            color: $color-primary;
            font-weight: bold;
            text-decoration: none;
        }
    }

    .sem-notificacao {
        text-align: center;
        padding: 4px 0;
    }
  }
}
</style>
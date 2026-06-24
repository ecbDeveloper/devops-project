<template>
    <div class="div-layout">
        <Header />

        <div class="fundo-de-tela">
            <Menu />

            <main>
                <div class="titulo-sessao">
                    <span>
                        <button v-if="isMobile" class="menu-mobile-btn" @click="menuSectionStore.setToggleMenu">
                            <i class="fas fa-bars"></i>
                        </button>
                        <h2>{{ titulo }}</h2>
                    </span>
                    <div>
                        <i class="fas fa-home"></i> / {{ complemento }}
                    </div>
                </div>
                <Loading v-if="carregando" />
                <slot v-else />
            </main>
        </div>

    </div>
</template>

<script setup lang="ts">

const menuSectionStore = useMenuSectionStore()
const pessoaStore = usePessoaStore()

const carregando = computed(() => pessoaStore.getCarregandoMe)

const titulo = computed(() => menuSectionStore.getTitulo)
const complemento = computed(() => menuSectionStore.getComplemento)

const isMobile = ref(false)

const checkWidth = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkWidth()
  window.addEventListener('resize', checkWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkWidth)
})

</script>

<style scoped lang="scss">

.div-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .fundo-de-tela {
    background-color: $color-septenary;
    display: flex;
    flex: 1;
    height: auto;
    padding-right: 8px;
    position: relative;
    overflow-x: hidden;
    width: 100vw;

    @include md {
        padding-left: 64px;
    }

    main {
        background: $color-tenth;
        border-radius: 24px;
        height: fit-content;
        min-height: 100%;
        width: 100%;

        .titulo-sessao {
            align-items: center;
            background-color: $color-quaternary;
            border-top-left-radius: 21px;
            border-top-right-radius: 21px;
            color: $color-nonary;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 16px 32px;

            h2 {
                font-size: 24px;
            }

            span {
                align-items: center;
                display: flex;
                gap: 16px;

                .menu-mobile-btn {
                    font-size: 24px;

                    i {
                        color: $color-white;
                    }
                }
            }

            div {
                align-items: center;
                display: none;
                gap: 8px;
                font-size: 16px;


                @include md {
                    display: flex;
                }

                i {
                    font-size: 16px;
                }
            }
        }
    }
  }
}

</style>
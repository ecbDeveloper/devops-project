<template>
  <div :class="['menu', { 'menu-fechado': !menuAberto }]">
    <div class="menu-titulo">
      <span v-show="menuAberto"></span>
      <div class="menu-hamburguer" @click="menuSectionStore.setToggleMenu">
        <i :class="!menuAberto ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </div>
    </div>

    <div class="navbar" >
        <MenuNavBar :menuFechado="!menuAberto" />
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits([ 'toggle'])

const menuSectionStore = useMenuSectionStore()

const menuAberto = computed(() => menuSectionStore.getMenu)

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
.menu {
  background-color: $color-septenary;
  height: 100vh;
  position: fixed;
  left: 0;
  transform: translateX(-100%);
  transition: width 0.3s ease;
  width: 100%;
  z-index: 1000;

  &.menu-fechado {
    transform: translateX(-100%);
    width: 64px;

    @include md {
      transform: none
    }
  }
  &:not(.menu-fechado) {
    transform: translateX(0);

    @include md {
      transform: none
    }
  }

  @include md {
    width: 360px;
    transform: none;
  }

}

.menu-titulo {
  display: flex;
  justify-content: space-between;
  min-height: 64px;
  padding: 16px 0px 16px 16px;
  position: relative;

  span {
    font-size: 24px;
  }

  .menu-hamburguer {
    align-items: center;
    display: flex;
    height: 100%;
    font-size: 24px;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    width: 64px;
    cursor: pointer;

    i {
      color: $color-tertiary;
    }
  }
}
</style>

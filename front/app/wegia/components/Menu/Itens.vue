<template>
    <li
        class="item"
        :class="{'sub-item': ehSubMenu, 'sub-item-azul': subMenu?.length && ehSubMenu }"
        @click="mudarSubmenuOuNavegar"
    >
        <div class="item-container">
            <i :class="icone" v-if="icone"></i>
            <span v-show="menuAberto">{{ texto }}</span>
        </div>

        <div class="seta" v-if="subMenu?.length && menuAberto">
            <i class="fas fa-chevron-down" :class="{ aberto: abrirOpcoes }"></i>
        </div>
    </li>

    <transition name="slide-fade">
        <ul v-if="abrirOpcoes && subMenu?.length && menuAberto" class="submenu">
            <MenuItens
                v-for="(item, index) in subMenu"
                :key="index"
                :texto="item?.nome"
                :icone="item?.icone"
                :link="item?.link"
                :subMenu="item?.submenu"
                :ehSubMenu="true"
            />
        </ul>
    </transition>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps({
   icone: String,
   texto: String,
   subMenu: Array,
   link: String,
   ehSubMenu: {
        type: Boolean,
        default: false
   },
   menuFechado: Boolean
});

const router = useRouter();
const menuSectionStore = useMenuSectionStore()

const menuAberto = computed(() => menuSectionStore.getMenu)

const abrirOpcoesLocal = ref(false)

const abrirOpcoes = computed(() => {
  if (!props.ehSubMenu) {
    return menuSectionStore.getSubMenu === props.texto
  }
  return abrirOpcoesLocal.value
})

const mudarSubmenuOuNavegar = () => {
    if(!menuAberto.value) menuSectionStore.setToggleMenu()

    if (props.subMenu?.length) {
        if (!props.ehSubMenu) {
            menuSectionStore.setSubMenu(props.texto!)
        } else {
            abrirOpcoesLocal.value = !abrirOpcoesLocal.value
        }
    } else if (props.link) {
        menuSectionStore.setToggleMenu()
        router.push(props.link);
    }
};
</script>


<style scoped lang="scss">

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    max-height: 1000px;
    opacity: 1;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
}

.item.sub-item.sub-item-azul {
    color: $color-primary;
}

.item.sub-item {
    padding: 4px 24px 4px 48px;

    &:hover {
        background: none;
    }

    .item-container {
        padding-left: 16px;
    }

}

.item {
    align-items: center;
    cursor: pointer;
    color: $color-quinary;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    padding: 10px 10px;
    position: relative;

    &:hover {
        background: rgb(33, 38, 45);
    }

    .item-container {
        align-items: center;
        display: flex;
        padding: 8px;

        i {
            font-size: 20px;
            margin: auto;
            margin-right: 16px;
            text-align: center;
            width: 20px;
        }
    }

    .seta {
        cursor: pointer;
        transition: transform 0.3s;
    }

    .seta .aberto {
        transform: rotate(180deg);
    }

    i {
        font-size: 16px;
    }

}

.submenu {
    background-color: $color-quaternary;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
    width: 100%;
    z-index: 10;
}
</style>

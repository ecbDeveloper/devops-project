<template>
    <ul>
        <MenuItens
            v-for="(item, index) in menuConfig"
            :key="index"
            :texto="item.nome"
            :icone="item.icone"
            :link="item.link"
            :subMenu="item.submenu"
            :menuFechado="menuFechado"
            class="itens-menu"
        />
    </ul>
</template>

<script setup lang="ts">
import { menuConfigMixin } from '~/mixins/menuConfigMixin';

defineProps<{
  menuFechado: boolean
}>()

const pessoaStore = usePessoaStore()

const temPermissao = (item: MenuInterface): boolean => {
  if (!item.permissao) return true

  if (Array.isArray(item.permissao)) {
    return item.permissao.some(p => pessoaStore.possuiPermissao(p))
  }

  return pessoaStore.possuiPermissao(item.permissao) ?? false
}

function filtrarMenu(menu: MenuInterface[]): MenuInterface[] {
  return menu.reduce<MenuInterface[]>((filtrados, item) => {
    const submenuFiltrado = item.submenu?.length
      ? filtrarMenu(item.submenu)
      : []

    const permitidoDiretamente = temPermissao(item)
    const permitidoPelosFilhos = submenuFiltrado.length > 0

    if (permitidoDiretamente || permitidoPelosFilhos) {
      filtrados.push({ ...item, submenu: submenuFiltrado })
    }

    return filtrados
  }, [])
}

const menuConfig = computed<MenuInterface[]>(() => filtrarMenu(menuConfigMixin.value))
</script>

<style scoped lang="scss">
ul {
    display: flex;
    flex-direction: column;

    .itens-menu {
        height: 48px;

        &:hover {
            background-color: rgb(33, 38, 45);
            cursor: pointer;
        }
    }
}
</style>

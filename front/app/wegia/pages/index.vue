<template>
    <div>
        <SectionBoxPages :itens="menuConfig" />
    </div>
</template>

<script setup lang="ts">

import { menuConfigMixin } from '~/mixins/menuConfigMixin';

const pessoaStore = usePessoaStore()

const temPermissao = (item: MenuInterface): boolean => {
  if (!item.permissao) return true

  if (Array.isArray(item.permissao)) {
    return item.permissao.some(p => pessoaStore.possuiPermissao(p))
  }

  return pessoaStore.possuiPermissao(item.permissao) ?? false
}

const filtrarMenuPorPermissao = (menu: MenuInterface[]): MenuInterface[] => {
  return menu.reduce<MenuInterface[]>((acc, item) => {
    const submenu = item.submenu?.length
      ? filtrarMenuPorPermissao(item.submenu)
      : []

    if (temPermissao(item) || submenu.length) {
      acc.push({ ...item, submenu })
    }

    return acc
  }, [])
}

const menuConfig = computed<MenuInterface[]>(() => filtrarMenuPorPermissao(menuConfigMixin.value))

</script>
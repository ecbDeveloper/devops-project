import { defineStore } from 'pinia';

export const useMenuSectionStore = defineStore('menuSections', {
  state: () => ({
    titulo: 'Menu' as String,
    complemento: 'Inicio' as String,
    abrirMenu: false as boolean,
    abrirSubMenu: '' as String
  }),
  getters: {
    getTitulo: (state) => state.titulo,
    getComplemento: (state) => state.complemento,
    getMenu: (state) => state.abrirMenu,
    getSubMenu: (state) => state.abrirSubMenu,
  },
  actions: {
    setTitulo(dado: String) {
      this.titulo = dado
    },
    setComplemento(dado: String) {
      this.complemento = dado
    },
    setToggleMenu() {
      this.abrirMenu = !this.abrirMenu

      if (!this.abrirMenu) {
        this.abrirSubMenu = ''
      }
    },
    setSubMenu(nome: String) {
      this.abrirSubMenu = this.abrirSubMenu === nome ? '' : nome
    }
  },
});
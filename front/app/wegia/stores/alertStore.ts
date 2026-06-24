import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    visivel: false,
    tipo: 'info',
    mensagem: '',
  }),
  getters: {
    getVisivel: (state) => state.visivel,
    getMensagem: (state) => state.mensagem,
    getTipo: (state) => state.tipo,
  },
  actions: {
    mostrarAlerta(tipo: string, mensagem: string) {
      this.visivel = true;
      this.tipo = tipo;
      this.mensagem = mensagem;
    },
    fecharAlerta() {
      this.visivel = false;
    },
  },
});
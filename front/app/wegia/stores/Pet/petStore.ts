import { PetCorEnum } from '@/constants/Pet/PetCorEnum'

export const usePetStore = defineStore('pet', {
    state: () => {
        return {
            pets: {} as PetPaginacaoInterface,
            pet: {} as PetInterface
        }
    },

    getters: {
        getPets: (state) => state.pets,
        getPet: (state) => state.pet,
        getCorParaSelect: () => {
            return Object.values(PetCorEnum).map((cor) => ({
                texto: cor,
                value: cor
            }));
        }
    },

    actions: {
        async fetchPet(id: number) {
            try {
                const { data } = await PetService.buscarPorId(id) as { data: PetInterface };
                this.pet = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchPets(params: Partial<PetBuscarTodosParamsInterface>) {
            try {
                const { data } = await PetService.listar(params) as { data: PetPaginacaoInterface };
                this.pets = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchCriarPet(body: any) {
            try {
                await PetService.criar(body)
            } catch (e) {
                throw e;
            }
        },

        async fetchCriarAdocao(id: number, body: AdocaoCadastrarInterface) {
            try {
                await PetService.criarAdocao(id, body)
            } catch (e) {
                throw e;
            }
        },

        async fetchAtualizarPet(body: any, id_pet: number) {
            try {
                await PetService.atualizarComFoto(id_pet, body)
            } catch (e) {
                throw e;
            }
        },

        async fetchAtualizarAdocao(id: number, body: Partial<AdocaoCadastrarInterface>) {
            try {
                await PetService.atualizarAdocao(id, body)
            } catch (e) {
                throw e;
            }
        },

        async fetchDeletarPet(id_pet: number) {
            try {
                await PetService.deletar(id_pet);
            } catch (e) {
                console.log(e);
                throw e;
            }
        },
    },
})

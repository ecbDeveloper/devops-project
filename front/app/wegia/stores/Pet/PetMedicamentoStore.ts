import { PetCorEnum } from '@/constants/Pet/PetCorEnum'

export const usePetMedicamentoStore = defineStore('petMedicamento', {
    state: () => {
        return {
            medicamentos: {} as PetMedicamentoPaginacaoInterface,
            medicamentosParaFiltros: [] as PetMedicamentoInterface[],
            medicamento: {} as PetMedicamentoInterface
        }
    },

    getters: {
        getMedicamentos: (state) => state.medicamentos,
        getMedicamento: (state) => state.medicamento,
        getMedicamentosParaFiltrosParaSelect: (state) => state.medicamentosParaFiltros?.map((e: PetMedicamentoInterface) => {
            return {
                texto: e.nome_medicamento,
                value: e.id_medicamento
            }
        }),
    },

    actions: {

        async fetchMedicamento(id: number) {
            try {
                const { data } = await PetMedicamentoService.buscarPorId(id) as { data: PetMedicamentoInterface };
                this.medicamento = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchMedicamentos(params: Partial<PetMedicamentoBuscarTodosParamsInterface>) {
            try {
                const { data } = await PetMedicamentoService.listar(params) as { data: PetMedicamentoPaginacaoInterface };
                this.medicamentos = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchMedicamentosParaFiltro() {
            try {
                const { data } = await PetMedicamentoService.listarParaFiltros() as { data: PetMedicamentoInterface[] };
                this.medicamentosParaFiltros = data;
            } catch (e) {
                throw e;
            }
        },

        async fetchCriarMedicamento(body: PetMedicamentoCadastrarInterface) {
            try {
                await PetMedicamentoService.criar(body)
            } catch (e) {
                throw e;
            }
        },

        async fetchAtualizarMedicamento(body: Partial<PetMedicamentoCadastrarInterface>, id: number) {
            try {
                await PetMedicamentoService.atualizar(id, body)
            } catch (e) {
                throw e;
            }
        },

        async fetchDeletarMedicamento(id: number) {
            try {
                await PetMedicamentoService.deletar(id);
            } catch (e) {
                console.log(e);
                throw e;
            }
        },
    },
})

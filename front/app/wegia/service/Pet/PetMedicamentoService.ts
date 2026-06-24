import BaseService from '../Base/BaseService'

class PetMedicamentoService  extends BaseService <PetMedicamentoCadastrarInterface, PetMedicamentoCadastrarInterface, PetMedicamentoBuscarTodosParamsInterface> {

  constructor() {
    super('/medicamento')
  }


  async listarParaFiltros() {
    return await useHttp(`${this.baseRoute}/filtro`);
  }
}
export default new PetMedicamentoService();

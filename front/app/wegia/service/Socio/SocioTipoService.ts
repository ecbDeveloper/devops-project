import BaseService from '../Base/BaseService'

class SocioTipoService  {

  protected baseRoute: string;

  constructor() {
    this.baseRoute = '/socio/tipo';
  }

  async filtro() {
      return await useHttp(`${this.baseRoute}/filtro`);
  }

}
export default new SocioTipoService();

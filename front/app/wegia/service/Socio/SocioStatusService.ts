class SocioStatusService  {

  protected baseRoute: string;

  constructor() {
    this.baseRoute = '/socio/status';
  }

  async filtro() {
      return await useHttp(`${this.baseRoute}/filtro`);
  }

}
export default new SocioStatusService();

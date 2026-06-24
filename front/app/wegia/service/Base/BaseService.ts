export default class BaseService<TCriar, TAtualizar, TParams> {
  protected baseRoute: string;

  constructor(baseRoute: string) {
      this.baseRoute = baseRoute;
  }

    criar(body: TCriar) {
        const ehFormData = body instanceof FormData

        return useHttp(`${this.baseRoute}`, {
            method: 'POST',
            body: ehFormData ? body : JSON.stringify(body)
        });
    }

  async listar(params?: Partial<TParams>) {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return await useHttp(`${this.baseRoute}${query}`);
  }

  async buscarPorId(id: number) {
      return await useHttp(`${this.baseRoute}/${id}`);
  }

  async atualizar(id: number, body: Partial<TAtualizar>) {
      return await useHttp(`${this.baseRoute}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body)
      });
  }

  async deletar(id: number) {
      return await useHttp(`${this.baseRoute}/${id}`, {
          method: 'DELETE'
      });
  }
}

import BaseService from '../Base/BaseService'
import type { DespachoCadastrarInterface } from '@/interface/Memorando/Despacho/DespachoCadastrarInterface'

class DespachoService extends BaseService <FormData | DespachoCadastrarInterface, any, any>{

  constructor() {
    super('/despacho')
  }

  async criarDespacho(body: FormData | DespachoCadastrarInterface, id: number) {
    const ehFormData = body instanceof FormData

    return await useHttp(`${this.baseRoute}/memorando/${id}`, {
      method: 'POST',
      body: ehFormData ? body : JSON.stringify(body)
  });
  }
}

export default new DespachoService()
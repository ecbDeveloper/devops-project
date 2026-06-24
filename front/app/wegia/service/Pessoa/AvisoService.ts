import BaseService from '../Base/BaseService'
import type { AvisoBuscarTodosParamsInterface } from '@/interface/Pessoa/Aviso/AvisoBuscarTodosParamsInterface'

class AvisoService extends BaseService <any, any, AvisoBuscarTodosParamsInterface>{

  constructor() {
    super('/aviso')
  }

}

export default new AvisoService()
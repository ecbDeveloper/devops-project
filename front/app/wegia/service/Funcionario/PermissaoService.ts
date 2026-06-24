import BaseService from '../Base/BaseService'

class PermissaoService extends BaseService <any, any, any>{

  constructor() {
    super('/funcionario/permissao')
  }

}

export default new PermissaoService()
import BaseService from '../Base/BaseService'
import type { PerfilPermissaoSincronizarInterface } from '@/interface/Funcionario/Perfil/PerfilPermissaoSincronizarInterface'
import type { PerfilCadastrarInterface } from '@/interface/Funcionario/Perfil/PerfilCadastrarInterface'

class PerfilService extends BaseService <PerfilCadastrarInterface, any, any>{

  constructor() {
    super('/funcionario/perfil')
  }

  async permissao(id: number) {
    return await useHttp(`${this.baseRoute}/${id}/permissao`);
  }

  async sincronizarPermissao(id: number, body: PerfilPermissaoSincronizarInterface) {
    return await useHttp(`${this.baseRoute}/${id}/permissao`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

}

export default new PerfilService()
import BaseService from '../Base/BaseService'
import type { MemorandoCadastrarInterface } from '@/interface/Memorando/MemorandoCadastrarInterface'
import type { MemorandoBuscarTodosParamsInterface } from '@/interface/Memorando/MemorandoBuscarTodosParamsInterface'
import type { MemorandoAtualizarInterface } from '@/interface/Memorando/MemorandoAtualizarInterface'

class MemorandoService extends BaseService <FormData | MemorandoCadastrarInterface, MemorandoAtualizarInterface, MemorandoBuscarTodosParamsInterface>{

  constructor() {
    super('/memorando')
  }

  async listarParticipados(params: MemorandoBuscarTodosParamsInterface) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return await useHttp(`${this.baseRoute}/participados${query}`);
  }

}

export default new MemorandoService()
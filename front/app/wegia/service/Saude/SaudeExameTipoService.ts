import BaseService from '../Base/BaseService'

class SaudeExameTipoService  extends BaseService <SaudeExameTipoCadastrarInterface, any, any> {

    constructor() {
        super('/saude/exame-tipo')
    }

}
export default new SaudeExameTipoService();

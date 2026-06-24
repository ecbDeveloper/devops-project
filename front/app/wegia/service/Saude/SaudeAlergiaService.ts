import BaseService from '../Base/BaseService'

class SaudeAlergiaService  extends BaseService <SaudeAlergiaCadastrarInterface, any, any> {

    constructor() {
        super('/saude/alergia')
    }

}
export default new SaudeAlergiaService();

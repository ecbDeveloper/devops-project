import BaseService from '../Base/BaseService'

class SaudeExameService  extends BaseService <any, any, any> {

    constructor() {
        super('/saude/exame')
    }

}
export default new SaudeExameService();

import BaseService from '../Base/BaseService'

class SaudeMedicoService  extends BaseService <any, any, any> {

    constructor() {
        super('/saude/medico')
    }

}
export default new SaudeMedicoService();

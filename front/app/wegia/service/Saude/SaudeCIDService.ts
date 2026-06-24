import BaseService from '../Base/BaseService'

class SaudeCIDService  extends BaseService <any, any, any> {

    constructor() {
        super('/saude/cid')
    }

}
export default new SaudeCIDService();

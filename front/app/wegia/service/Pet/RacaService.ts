import BaseService from '../Base/BaseService'

class RacaService  extends BaseService <RacaInterface | any, any, any> {

    constructor() {
        super('/raca')
    }

}
export default new RacaService();

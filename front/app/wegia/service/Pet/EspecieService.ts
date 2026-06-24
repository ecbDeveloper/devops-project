import BaseService from '../Base/BaseService'

class EspecieService  extends BaseService <EspecieInterface | any, any, any> {

    constructor() {
        super('/especie')
    }

}
export default new EspecieService();

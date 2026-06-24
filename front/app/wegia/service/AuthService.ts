import type { AuthLoginInterface } from "~/interface/Auth/AuthLoginInterface";

class AuthService {

    protected baseRoute = '/auth'

    async login(body: AuthLoginInterface) {
        return await useHttp(`${this.baseRoute}/login`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async logout() {
        return await useHttp(`${this.baseRoute}/logout`, {
            method: 'POST'
        });
    }

}

export default new AuthService()
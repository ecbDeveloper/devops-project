class CepService {

    async getEndereco(cep: string, formato: string = 'json') {
        return await useCep(`/${cep}/${formato}`);
    }

}

export default new CepService()
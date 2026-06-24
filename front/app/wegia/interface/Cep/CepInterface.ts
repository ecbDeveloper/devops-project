export interface CepInterface {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
    ddd: string;
    ibge: string;
    gia: string;
    siafi: string;
    unidade: string;
    regiao: string;
    
    erro: string;

    [key: string]: string; 
}
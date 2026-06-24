export interface PetInterface {
    id_pet: number;
    nome: string;
    data_nascimento: string;
    data_acolhimento: string;
    sexo: 'M' | 'F';
    caracteristicas_especificas: string;
    id_pet_foto: number | null;
    id_pet_especie: number;
    id_pet_raca: number;
    cor: string;
    especie: EspecieInterface | null
    raca: RacaInterface | null
    foto: PetFotoInterface | null
    ficha_medica: FichaMedicaInterface | null
    adocao: AdotanteInterface | null
}
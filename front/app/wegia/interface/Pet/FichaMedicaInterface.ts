export interface FichaMedicaInterface {
    id_ficha_medica: number
    id_pet: number
    castrado: string
    necessidades_especiais: string
    atendimento: PetAtendimentoInterface[]
}
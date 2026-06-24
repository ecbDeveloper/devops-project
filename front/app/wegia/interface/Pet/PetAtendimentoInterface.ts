export interface PetAtendimentoInterface {
  id_pet_atendimento: number
  id_ficha_medica: number
  data_atendimento: string
  descricao: string
  medicacao: PetMedicacaoInterface[]
}
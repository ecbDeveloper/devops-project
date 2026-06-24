export interface PetMedicacaoInterface {
  id_medicacao: number
  id_medicamento: number
  id_pet_atendimento: number
  data_medicacao: string
  medicamento: PetMedicamentoInterface
}
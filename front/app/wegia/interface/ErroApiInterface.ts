export interface ErroApiInterface {
  message: string
  errors?: Record<string, string[]>
}
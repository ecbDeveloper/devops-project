import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { FetchError } from 'ofetch'

export const atendidoAceitacaoCPF = {
  titulo: '',
  itens: [
    {
      nome: 'cpf',
      label: "CPF",
      type: 'text',
      value: '',
      erro: '',
      mask: Mascara.cpf,
      formatarParaEnviar: [/\D/g, ''],
      validacao: ValidateForm.cpfValidacao,
      obrigatorio: true
    }
  ]
}

export const atendidoAceitacao = {
  titulo: '',
  itens: [
    {
      nome: 'nome',
      label: "Nome",
      type: 'text',
      value: '',
      erro: '',
      validacao: ValidateForm.obrigatorio,
      obrigatorio: true,
      desabilitado: false
    },
    {
      nome: 'sobrenome',
      label: "Sobrenome",
      type: 'text',
      value: '',
      erro: '',
      validacao: ValidateForm.obrigatorio,
      obrigatorio: true,
      desabilitado: false
    },
    {
      nome: 'cpf',
      label: "CPF",
      type: 'text',
      value: '',
      erro: '',
      mask: Mascara.cpf,
      formatarParaEnviar: [/\D/g, ''],
      validacao: ValidateForm.cpfValidacao,
      obrigatorio: true,
      desabilitado: true
    }
  ]
}
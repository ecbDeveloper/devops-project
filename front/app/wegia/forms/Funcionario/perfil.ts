import type { FormularioInterface } from "~/interface/Formulario/FormularioInterface";
import type { PerfilCadastrarInterface } from "~/interface/Funcionario/Perfil/PerfilCadastrarInterface";

export const cadastrarPerfil = {
  titulo: '',
  itens: [
      {
        nome: 'cargo',
        label: "Cargo",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
      },
      {
        nome: 'nome',
        label: "Perfil",
        type: 'text',
        value: '',
        erro: '',
        validacao: ValidateForm.obrigatorio,
      }
  ]
}


export const enviarCadastroPerfil = async (formulario: { titulo: string; itens: FormularioInterface[] }) => {

    const perfilStore = usePerfilStore()
    const alertStore = useAlertStore()

    const validacao = await ValidateForm.validate([formulario])

    if(!validacao) return

    const formData = criarFormData([formulario])
    const json = formDataParaJson(formData) as PerfilCadastrarInterface

    return await perfilStore.fetchCadastrarPerfil(json).then((response) => {
        alertStore.mostrarAlerta('success', 'Perfil cadastrado com sucesso')
    }).catch(e => {
        console.log(e)
        alertStore.mostrarAlerta('error', 'Erro ao cadastrar!')
    })
}
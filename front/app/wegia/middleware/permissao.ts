export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client) {

    const pessoaStore = usePessoaStore()
    const alertStore = useAlertStore()
    const requiredPermission = to.meta.permission as string | undefined

    if (!pessoaStore?.getPessoa?.nome) {
      await pessoaStore.fetchMe('funcionario.perfil.permissoes,avisos')
    }

    if (requiredPermission && !pessoaStore.possuiPermissao(requiredPermission)) {
      alertStore.mostrarAlerta('error', 'Você não tem permissão para acessar essa rota!')
      return navigateTo('/')
    }
  }
})
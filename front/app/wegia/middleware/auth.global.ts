export default defineNuxtRouteMiddleware((to, from) => {
    const pessoaStore = usePessoaStore();

    const publicRoutes = [
        '/contribuicao',
        '/contribuicao/segunda-via',
        '/contribuicao/gerar-comprovante',
        '/login'
    ]

    if (publicRoutes.includes(to.path)) {
        return
    }

    if (process.client) {
        const authCookie = buscarTokenCookie()

        if (!authCookie?.value) {
            if(to.path !== '/login') {
                return navigateTo('/login');
            }
        } else {
            if(pessoaStore.getPessoa) {
                pessoaStore.fetchMe('funcionario.perfil.permissoes,avisos')
            }

            if (to.path === '/login') {
                return navigateTo('/');
            }
        }
    }
});
import type { AuthInterface } from "~/interface/Auth/AuthInterface"
import type { AuthLoginInterface } from "~/interface/Auth/AuthLoginInterface"
import type { AuthTokenInterface } from "~/interface/Auth/AuthTokenInterface"

import AuthService from "~/service/AuthService"

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            token: {} as AuthTokenInterface
        }
    },
    getters: {
      getToken: (state) => state.token,
    },
    actions: {
      async fetchLogin(credenciais: AuthLoginInterface) {
        try {
            const { data } = await AuthService.login(credenciais) as AuthInterface

            const pessoaStore = usePessoaStore()
            const router = useRouter();

            this.token = data.token
            salvarTokenCookie(data.token)

            pessoaStore.setPessoa(data.pessoa)

            router.push('/')
        } catch (error) {
            const alertStore = useAlertStore()
            alertStore.mostrarAlerta('error', 'Usuário ou senha inválidos!')
            console.log(error)
            throw error;
        }

      },
      async fetchSair() {
        const alertStore = useAlertStore()

        try {
          await AuthService.logout()

          const pessoaStore = usePessoaStore()
          const router = useRouter();

          removerTokenCookie()

          pessoaStore.setPessoa(null)

          router.push('/login')
          alertStore.mostrarAlerta('success', 'Usuário Deslogado!')
      } catch (error) {
          alertStore.mostrarAlerta('error', 'Usuário ou senha inválidos!')
          throw error;
      }
      }
    },
  })
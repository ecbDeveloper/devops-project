import type { AuthTokenInterface } from "~/interface/Auth/AuthTokenInterface";

function salvarTokenCookie(data: AuthTokenInterface) {

    const maxAge = gerandoExpiraEmSegundos(data.expira_em)

    const authCookie = useCookie('auth', {
      maxAge: maxAge > 0 ? maxAge : 0,
      sameSite: 'strict'
    })

    authCookie.value = JSON.stringify(data);
}

function removerTokenCookie() {
  const authCookie = useCookie('auth')
  authCookie.value = null
}


function buscarTokenCookie() : {value: AuthTokenInterface} | null {
    return useCookie('auth');
}

function gerandoExpiraEmSegundos(expira_em: string) {
    const expiraEm = new Date(expira_em).getTime() / 1000;
    const agora = Math.floor(Date.now() / 1000);

    return expiraEm - agora;
}

export {
  salvarTokenCookie,
  buscarTokenCookie,
  removerTokenCookie
}
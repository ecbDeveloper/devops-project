const useHttp = (endpoint: string, options: RequestInit = {}) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.BASE_URL_API_WEGIA;
  const url = process.client ? `/api-wegia${endpoint}` : `${baseURL}/api${endpoint}`;

  const dataToken = buscarTokenCookie()
  let autenticador = ''

  if(dataToken?.value) {
    autenticador = dataToken?.value ? `${dataToken.value.tipo} ${dataToken.value.token}` : ''
  }

  return $fetch(url, {
    method: options.method || 'GET',
    headers: {
      //'Accept': 'application/json',
      //'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': autenticador,
    },
    ...options,
  });
};

export default useHttp;
const useHttpPagarMe = (endpoint: string, options: RequestInit = {}) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.BASE_URL_API_PAGAR_ME;
  const url = process.client ? `/api-pagar-me${endpoint}` : `${baseURL}${endpoint}`;

  return $fetch(url, {
    method: options.method || 'GET',
    headers: {
      ...options.headers
    },
    ...options,
  });
};

export default useHttpPagarMe;
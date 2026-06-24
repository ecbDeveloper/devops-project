const useCep = (endpoint: string, options: RequestInit = {}) => {
    const config = useRuntimeConfig();
    const baseURL = config.public.BASE_URL_API_CEP;
    const url = `${baseURL}${endpoint}`;
  
  
    return $fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  };
  
  export default useCep;
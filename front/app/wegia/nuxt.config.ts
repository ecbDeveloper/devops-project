// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      BASE_URL_API_WEGIA: process.env.BASE_URL_API_WEGIA,
      BASE_URL_API_CEP: process.env.BASE_URL_API_CEP,
      BASE_URL_API_PAGAR_ME: process.env.BASE_URL_API_PAGAR_ME,
      PUBLIC_KEY_PAGAR_ME: process.env.PUBLIC_KEY_PAGAR_ME,
    },

  },

  vite: {
    server: {
      proxy: {
        '/api-wegia': {
          target: process.env.BASE_URL_API_WEGIA,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api-wegia/, '/api'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        '/api/upload/': {
          target: process.env.BASE_URL_API_WEGIA,
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        '/api-pagar-me': {
          target: process.env.BASE_URL_API_PAGAR_ME,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api-pagar-me/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
      watch: {
        usePolling: true,
        interval: 500,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:color";
            @use "@/assets/scss/variables" as *;
            @use "@/assets/scss/responsive" as *;
          `,
        },
      },
    },
  },

  modules: ['@pinia/nuxt'],
  css: ["@/assets/scss/default.scss"],

  imports: {
    dirs: [
      'stores',
      'interface/**/',
      'service/**/',
      'constants/**/'
    ]
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },


  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})

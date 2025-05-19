export default {
  expo: {
    name: 'RiverSpain',
    slug: 'riverspain',
    version: '1.0.0',
    orientation: 'portrait',
    android: {
      package: 'com.markius.riverspain',
      adaptiveIcon: {
        foregroundImage: "./img/logo-azul.png",
        backgroundColor: '#ffffff'
      }
    },
    extra: {
      eas: {
        projectId: '9ddc1cdf-b81a-4f24-9c3c-1b865a1e63a8',
      },
      apiUrl: 'https://institutions-carriers-interpreted-explains.trycloudflare.com/riverspain', // Fallback por si no se carga .env
    },
  },
};
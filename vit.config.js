export default {
    build: {
      target: 'esnext',
    },
    server: {
      proxy: {
        '/api': {
          target: 'your-worker-url',
          changeOrigin: true
        }
      }
    }
  }
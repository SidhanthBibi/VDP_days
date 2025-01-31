module.exports = {
  root: true,
  base: '/',
  plugins: ['vite-plugin-react'],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
};
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   css: {
//     modules: {
//       localsConvention: "camelCase",
//     }
//   }
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.sahabatbmeitb.my.id', // Ubah ke API-mu yang benar
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Hapus "/api" jika tidak perlu
      },
    },
  },
});



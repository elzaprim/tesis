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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    proxy: {
      // Proxy endpoint `/jadwal` ke URL API yang sesungguhnya
      '/jadwal': 'https://77de-114-10-149-218.ngrok-free.app',
    },
  },
});


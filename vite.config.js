import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // Permet au serveur d'écouter toutes les interfaces réseau
    port: 5173,      // Utilise le port par défaut ou spécifiez-en un autre si nécessaire
    allowedHosts: 'all', // Autorise toutes les requêtes, même depuis un réseau externe
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws', // Fixe les problèmes de WebSocket dans Docker
    },
  },
})

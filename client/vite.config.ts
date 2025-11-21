import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
    plugins: [vue(), tailwindcss()],

    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src/app'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@entities': path.resolve(__dirname, 'src/entities'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@widgets': path.resolve(__dirname, 'src/widgets'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@processes': path.resolve(__dirname, 'src/processes'),
            '@': path.resolve(__dirname, 'src')
        }
    },

    server: {
        port: 5173,
        strictPort: true
    }
})

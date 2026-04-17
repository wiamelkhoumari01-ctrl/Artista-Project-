import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            laravel({
                input: ['resources/js/main.jsx'],
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: '127.0.0.1',
            port: 5173,
            strictPort: true,
            hmr: {
                host: '127.0.0.1',
            },
        },
        define: {
            // Utilise la variable du fichier .env au lieu du texte en dur
            __GOOGLE_CLIENT_ID__: JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
        },
    };
});
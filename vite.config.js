import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
        // Expose explicitement les variables VITE_ au frontend
        __GOOGLE_CLIENT_ID__: JSON.stringify(
            '832417069767-tumkpqutir1v6juarh1ugv4h9fr9cvk8.apps.googleusercontent.com'
        ),
    },
});
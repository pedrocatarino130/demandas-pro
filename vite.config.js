import {
    defineConfig
} from 'vite';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['date-fns'],
                    firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
                    idb: ['idb']
                }
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
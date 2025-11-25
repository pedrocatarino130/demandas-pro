import {
    defineConfig
} from 'vite';

export default defineConfig({
    // Base path pode ser configurado via variável de ambiente
    // Para GitHub Pages em subdiretório, use: BASE_URL=/demandas-pro/ npm run build
    base: process.env.BASE_URL || './',
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
        },
        // Copiar service worker para dist
        copyPublicDir: true,
        // Garantir que os módulos ES sejam tratados corretamente
        commonjsOptions: {
            include: [/node_modules/]
        }
    },
    publicDir: 'public',
    resolve: {
        // Garantir resolução correta de módulos
        dedupe: ['firebase']
    },
    optimizeDeps: {
        // Incluir Firebase nas dependências otimizadas
        include: ['firebase/app', 'firebase/firestore', 'firebase/auth']
    },
    server: {
        port: 3000,
        open: true
    }
});
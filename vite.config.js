import {
    defineConfig
} from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Plugin para processar manifest.json com base path correto
function manifestPlugin() {
    return {
        name: 'manifest-plugin',
        apply: 'build',
        closeBundle() {
            const manifestPath = resolve(__dirname, 'dist/manifest.json');
            const baseUrl = process.env.BASE_URL || './';
            
            try {
                const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
                
                // Ajustar caminhos com base no BASE_URL
                if (baseUrl !== './') {
                    // Remover barra final se existir
                    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                    
                    manifest.start_url = normalizedBase + '/';
                    manifest.scope = normalizedBase + '/';
                    
                    if (manifest.icons) {
                        manifest.icons = manifest.icons.map(icon => ({
                            ...icon,
                            src: normalizedBase + icon.src
                        }));
                    }
                } else {
                    // Para caminho relativo, usar ./
                    manifest.start_url = './';
                    manifest.scope = './';
                    
                    if (manifest.icons) {
                        manifest.icons = manifest.icons.map(icon => ({
                            ...icon,
                            src: '.' + icon.src
                        }));
                    }
                }
                
                writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
                console.log('✓ Manifest.json processado com sucesso');
            } catch (error) {
                console.error('Erro ao processar manifest.json:', error);
            }
        }
    };
}

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
    plugins: [manifestPlugin()],
    resolve: {
        // Garantir resolução correta de módulos
    },
    optimizeDeps: {
        // Dependências otimizadas
    },
    server: {
        port: 3000,
        open: true
    }
});
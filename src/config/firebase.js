/**
 * Configuração Firebase
 * Inicializa e configura o Firebase Firestore para sincronização de dados
 * Suporta variáveis de ambiente (desenvolvimento) e arquivo de configuração (produção)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { buildAssetPath } from '../utils/base-path.js';

// Configuração do Firebase - primeiro tenta variáveis de ambiente, depois arquivo JSON
let firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Flag para indicar se já tentou carregar do arquivo JSON
let configLoaded = false;

/**
 * Carrega configuração do Firebase de um arquivo JSON (útil para GitHub Pages)
 */
async function loadFirebaseConfigFromFile() {
    if (configLoaded) return;
    configLoaded = true;

    try {
        const configPath = buildAssetPath('firebase-config.json');
        console.log('🔍 Tentando carregar Firebase config de:', configPath);
        const response = await fetch(configPath);
        
        if (response.ok) {
            const fileConfig = await response.json();
            console.log('📄 Arquivo firebase-config.json carregado:', fileConfig);
            
            // Verificar se o arquivo tem configuração válida
            const hasConfig = fileConfig.apiKey && 
                              fileConfig.authDomain && 
                              fileConfig.projectId && 
                              fileConfig.storageBucket && 
                              fileConfig.messagingSenderId && 
                              fileConfig.appId;
            
            if (hasConfig) {
                // Mesclar configuração do arquivo apenas se as variáveis de ambiente não estiverem definidas
                // No GitHub Pages, import.meta.env.VITE_* sempre será undefined em runtime
                const hasEnvVars = import.meta.env.VITE_FIREBASE_API_KEY && 
                                   import.meta.env.VITE_FIREBASE_API_KEY.trim() !== '';
                
                if (!hasEnvVars) {
                    firebaseConfig = { ...firebaseConfig, ...fileConfig };
                    console.log('✅ Configuração do Firebase carregada de firebase-config.json');
                    return true;
                } else {
                    console.log('ℹ️ Variáveis de ambiente encontradas, usando-as em vez do arquivo JSON');
                }
            } else {
                console.warn('⚠️ Arquivo firebase-config.json encontrado mas está vazio ou incompleto');
                console.warn('   Preencha o arquivo public/firebase-config.json com suas credenciais do Firebase');
            }
        } else {
            // Arquivo não encontrado ou erro
            console.warn(`⚠️ Não foi possível carregar firebase-config.json (status: ${response.status})`);
            console.warn(`   URL tentada: ${configPath}`);
            if (response.status === 404) {
                console.warn('   Arquivo não encontrado. Crie o arquivo public/firebase-config.json com suas credenciais.');
            }
        }
    } catch (error) {
        // Erro ao carregar arquivo
        console.error('❌ Erro ao carregar firebase-config.json:', error);
        console.error('   Detalhes:', error.message);
    }
    
    return false;
}

// Verificar se todas as variáveis necessárias estão configuradas
const isFirebaseConfigured = () => {
    return !!(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
    );
};

// Inicializar Firebase apenas se configurado
let app = null;
let db = null;
let auth = null;
let initializationPromise = null;

/**
 * Inicializa o Firebase (assíncrono para permitir carregar config do arquivo)
 */
async function initializeFirebase() {
    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        // Verificar se variáveis de ambiente estão definidas
        const hasEnvVars = import.meta.env.VITE_FIREBASE_API_KEY && 
                          import.meta.env.VITE_FIREBASE_API_KEY.trim() !== '';
        
        // Tentar carregar configuração do arquivo se variáveis de ambiente não estiverem definidas
        // No GitHub Pages, sempre tentar carregar do arquivo
        if (!hasEnvVars) {
            console.log('🔍 Variáveis de ambiente não encontradas, tentando carregar de firebase-config.json...');
            await loadFirebaseConfigFromFile();
        } else {
            console.log('✅ Usando variáveis de ambiente para configuração do Firebase');
        }

        if (isFirebaseConfigured()) {
            try {
                // Inicializar Firebase App
                app = initializeApp(firebaseConfig);
                
                // Inicializar Firestore
                db = getFirestore(app);
                
                // Inicializar Auth (para uso futuro)
                auth = getAuth(app);
                
                // Conectar emuladores se estiver em desenvolvimento e usando emuladores
                // Descomentar se necessário para desenvolvimento local com emuladores
                /*
                if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
                    try {
                        connectFirestoreEmulator(db, 'localhost', 8080);
                        connectAuthEmulator(auth, 'http://localhost:9099');
                        console.log('🔥 Firebase Emulators conectados');
                    } catch (error) {
                        console.warn('⚠️ Erro ao conectar emuladores (já conectado?):', error);
                    }
                }
                */
                
                console.log('✅ Firebase inicializado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao inicializar Firebase:', error);
                // Manter null para funcionar em modo offline apenas
                app = null;
                db = null;
                auth = null;
            }
        } else {
            console.warn('⚠️ Firebase não configurado. Sistema funcionará apenas localmente.');
            console.warn('');
            console.warn('📝 Para configurar o Firebase:');
            console.warn('   1. Desenvolvimento local: Crie um arquivo .env.local com VITE_FIREBASE_*');
            console.warn('   2. GitHub Pages: Edite public/firebase-config.json com suas credenciais');
            console.warn('');
            console.warn('💡 Veja README-FIREBASE.md para mais detalhes');
        }
    })();

    return initializationPromise;
}

// Detectar se estamos em produção/GitHub Pages
const isProduction = import.meta.env.PROD || 
                     (typeof window !== 'undefined' && 
                      (window.location.hostname.includes('github.io') || 
                       window.location.hostname.includes('github.com')));

// Inicializar Firebase
// Em produção, sempre tentar carregar do arquivo JSON primeiro
if (isProduction) {
    // Em produção, sempre tentar carregar do arquivo
    initializeFirebase().catch(err => {
        console.warn('Erro ao inicializar Firebase:', err);
    });
} else if (isFirebaseConfigured()) {
    // Em desenvolvimento, se já estiver configurado (variáveis de ambiente), inicializar imediatamente
    initializeFirebase();
} else {
    // Em desenvolvimento sem config, tentar carregar do arquivo
    initializeFirebase().catch(err => {
        console.warn('Erro ao inicializar Firebase:', err);
    });
}

// Exportar instâncias (podem ser null até inicialização completa)
export { app, db, auth };

// Exportar função de inicialização
export { initializeFirebase };

// Exportar objeto padrão para compatibilidade
export default {
    app,
    db,
    auth,
    isConfigured: isFirebaseConfigured,
    initialize: initializeFirebase
};

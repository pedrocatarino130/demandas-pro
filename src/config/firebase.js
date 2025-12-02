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
    if (configLoaded) {
        return isFirebaseConfigured();
    }
    configLoaded = true;

    try {
        const configPath = buildAssetPath('firebase-config.json');
        console.log('🔍 Carregando Firebase config de:', configPath);
        const response = await fetch(configPath, {
            cache: 'no-cache' // Garantir que sempre busque a versão mais recente
        });
        
        if (response.ok) {
            const fileConfig = await response.json();
            
            // Verificar se o arquivo tem configuração válida
            const hasConfig = fileConfig.apiKey && 
                              fileConfig.apiKey.trim() !== '' &&
                              fileConfig.authDomain && 
                              fileConfig.authDomain.trim() !== '' &&
                              fileConfig.projectId && 
                              fileConfig.projectId.trim() !== '' &&
                              fileConfig.storageBucket && 
                              fileConfig.storageBucket.trim() !== '' &&
                              fileConfig.messagingSenderId && 
                              fileConfig.messagingSenderId.trim() !== '' &&
                              fileConfig.appId &&
                              fileConfig.appId.trim() !== '';
            
            if (hasConfig) {
                // Usar configuração do arquivo (tem prioridade sobre variáveis de ambiente em produção)
                firebaseConfig = { ...fileConfig };
                console.log('✅ Configuração do Firebase carregada de firebase-config.json');
                return true;
            } else {
                console.warn('⚠️ Arquivo firebase-config.json encontrado mas está vazio ou incompleto');
            }
        } else {
            // Arquivo não encontrado - não é erro crítico se variáveis de ambiente existirem
            if (response.status === 404) {
                console.log('ℹ️ Arquivo firebase-config.json não encontrado em:', configPath);
            } else {
                console.warn(`⚠️ Erro ao carregar firebase-config.json (status: ${response.status})`);
            }
        }
    } catch (error) {
        // Erro ao carregar arquivo - não é crítico se variáveis de ambiente existirem
        console.log('ℹ️ Não foi possível carregar firebase-config.json:', error.message);
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
        // SEMPRE tentar carregar do arquivo primeiro (funciona em produção e desenvolvimento)
        const fileLoaded = await loadFirebaseConfigFromFile();
        
        // Se o arquivo não foi carregado ou não tinha config válida, verificar variáveis de ambiente
        if (!fileLoaded) {
            const hasEnvVars = import.meta.env.VITE_FIREBASE_API_KEY && 
                              import.meta.env.VITE_FIREBASE_API_KEY.trim() !== '';
            if (hasEnvVars) {
                console.log('✅ Usando variáveis de ambiente para configuração do Firebase');
            }
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

// Inicializar Firebase imediatamente
// Sempre tentará carregar do arquivo JSON primeiro, depois variáveis de ambiente
initializeFirebase().catch(err => {
    console.error('Erro crítico ao inicializar Firebase:', err);
});

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

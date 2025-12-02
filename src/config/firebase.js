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
        const response = await fetch(configPath);
        
        if (response.ok) {
            const fileConfig = await response.json();
            
            // Mesclar configuração do arquivo apenas se as variáveis de ambiente não estiverem definidas
            if (!import.meta.env.VITE_FIREBASE_API_KEY && fileConfig.apiKey) {
                firebaseConfig = { ...firebaseConfig, ...fileConfig };
                console.log('✅ Configuração do Firebase carregada de firebase-config.json');
            }
        } else {
            // Arquivo não encontrado ou erro - não é crítico se variáveis de ambiente estiverem definidas
            if (!import.meta.env.VITE_FIREBASE_API_KEY) {
                console.log('ℹ️ Arquivo firebase-config.json não encontrado. Firebase funcionará apenas localmente.');
            }
        }
    } catch (error) {
        // Erro ao carregar arquivo - não é crítico
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            console.log('ℹ️ Não foi possível carregar firebase-config.json:', error.message);
        }
    }
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
        // Tentar carregar configuração do arquivo se variáveis de ambiente não estiverem definidas
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            await loadFirebaseConfigFromFile();
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
            console.warn('   Configure as variáveis de ambiente VITE_FIREBASE_* ou edite public/firebase-config.json');
        }
    })();

    return initializationPromise;
}

// Inicializar imediatamente se já estiver configurado (variáveis de ambiente)
if (isFirebaseConfigured()) {
    initializeFirebase();
} else {
    // Tentar carregar do arquivo em background
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

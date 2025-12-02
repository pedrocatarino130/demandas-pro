/**
 * Configuração Firebase
 * Inicializa e configura o Firebase Firestore para sincronização de dados
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Configuração do Firebase a partir das variáveis de ambiente
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

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
    console.warn('   Configure as variáveis de ambiente VITE_FIREBASE_* para habilitar sincronização.');
}

// Exportar instâncias
export { app, db, auth };

// Exportar objeto padrão para compatibilidade
export default {
    app,
    db,
    auth,
    isConfigured: isFirebaseConfigured
};

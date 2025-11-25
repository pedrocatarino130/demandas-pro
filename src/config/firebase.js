/**
 * Configuração do Firebase
 * Inicializa e exporta os serviços do Firebase
 */

import {
    initializeApp
} from 'firebase/app';
import {
    getFirestore,
    enableIndexedDbPersistence,
    connectFirestoreEmulator
} from 'firebase/firestore';
import {
    getAuth
} from 'firebase/auth';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validar configuração
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('⚠️ Firebase não configurado. Usando modo offline apenas.');
}

// Inicializar Firebase
let app;
let db;
let auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Habilitar persistência offline do Firestore (cache local)
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            // Múltiplas abas abertas, persistência só pode ser habilitada em uma
            console.warn('⚠️ Persistência offline do Firestore não habilitada: múltiplas abas abertas');
        } else if (err.code === 'unimplemented') {
            // Navegador não suporta persistência
            console.warn('⚠️ Persistência offline do Firestore não suportada neste navegador');
        } else {
            console.error('❌ Erro ao habilitar persistência offline:', err);
        }
    });

    console.log('✅ Firebase inicializado com sucesso');
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    // Em caso de erro, criar objetos vazios para evitar quebra da aplicação
    db = null;
    auth = null;
}

export {
    app,
    db,
    auth
};
export default {
    app,
    db,
    auth
};
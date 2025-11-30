/**
 * Script de Migração - REMOVIDO
 * 
 * Este arquivo foi mantido apenas para compatibilidade.
 * O sistema agora funciona apenas com armazenamento local.
 */

import { firebaseCache } from '../services/firebase-cache.js';

const USER_ID = 'default';

/**
 * Stub - não migra mais para Firestore
 */
export async function migrateLocalStorageToFirebase() {
    console.log('⚠️ Migração para Firestore desabilitada - sistema agora é 100% local');
    return { success: true, skipped: true };
}

/**
 * Stub - cria backup local apenas
 */
export async function createBackup() {
    const backup = {};
    
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                try {
                    backup[key] = localStorage.getItem(key);
                } catch (e) {
                    console.warn(`Erro ao fazer backup de ${key}:`, e);
                }
            }
        }

        // Salvar backup no cache
        await firebaseCache.init();
        await firebaseCache.set('localStorage-backup', {
            timestamp: new Date().toISOString(),
            data: backup
        });

        console.log('✅ Backup criado com sucesso');
        return { success: true, itemCount: Object.keys(backup).length };
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
        return { success: false, error: error.message };
    }
}

// Exportar função principal
export default migrateLocalStorageToFirebase;

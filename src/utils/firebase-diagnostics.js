/**
 * Utilitário de Diagnóstico do Firebase
 * Verifica se Firebase está configurado e funcionando corretamente
 */

import { db, isFirebaseConfigured } from '../config/firebase.js';
import { firebaseService } from '../services/firebase-service.js';
import { firebaseSync } from '../services/firebase-sync.js';

/**
 * Verifica status do Firebase e exibe diagnóstico no console
 */
export async function diagnoseFirebase() {
    console.group('🔥 Diagnóstico Firebase');
    
    // 1. Verificar configuração
    console.log('1. Verificando configuração...');
    const isConfigured = firebaseService.isAvailable();
    console.log(`   ${isConfigured ? '✅' : '❌'} Firebase ${isConfigured ? 'configurado' : 'não configurado'}`);
    
    if (!isConfigured) {
        console.warn('   ⚠️ Configure as variáveis VITE_FIREBASE_* no .env.local');
        console.groupEnd();
        return false;
    }
    
    // 2. Verificar conexão com Firestore
    console.log('2. Testando conexão com Firestore...');
    try {
        // Tentar uma operação simples de leitura
        const testCollection = await firebaseService.getCollection('_test', [], null, 'asc', 1);
        console.log('   ✅ Conexão com Firestore OK');
    } catch (error) {
        console.error('   ❌ Erro ao conectar com Firestore:', error.message);
        console.warn('   Verifique:');
        console.warn('   - Credenciais corretas no .env.local');
        console.warn('   - Regras de segurança do Firestore');
        console.warn('   - Conexão com internet');
        console.groupEnd();
        return false;
    }
    
    // 3. Verificar status de sincronização
    console.log('3. Status de sincronização...');
    const isOnline = firebaseSync.getOnlineStatus();
    const hasPending = firebaseSync.hasPendingOperations();
    const pendingCount = firebaseSync.getPendingCount();
    
    console.log(`   ${isOnline ? '🌐' : '📴'} Status: ${isOnline ? 'Online' : 'Offline'}`);
    console.log(`   ${hasPending ? '⏳' : '✅'} Operações pendentes: ${pendingCount}`);
    
    // 4. Verificar estrutura de dados
    console.log('4. Verificando estrutura de dados...');
    const collections = [
        'tarefas',
        'tarefasRotina',
        'historico',
        'categorias',
        'areasEstudo',
        'topicosEstudo'
    ];
    
    for (const collection of collections) {
        try {
            const count = (await firebaseService.getCollection(collection)).length;
            if (count > 0) {
                console.log(`   ✅ ${collection}: ${count} documento(s)`);
            }
        } catch (error) {
            console.warn(`   ⚠️ ${collection}: erro ao verificar`);
        }
    }
    
    console.log('5. Resumo:');
    console.log(`   Firebase: ${isConfigured ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`   Conexão: ${isOnline ? '✅ Online' : '❌ Offline'}`);
    console.log(`   Pendências: ${pendingCount > 0 ? `⏳ ${pendingCount}` : '✅ Nenhuma'}`);
    
    console.groupEnd();
    return true;
}

/**
 * Verifica se Firebase está funcionando e retorna status
 */
export async function checkFirebaseStatus() {
    const status = {
        configured: firebaseService.isAvailable(),
        online: firebaseSync.getOnlineStatus(),
        pendingOperations: firebaseSync.getPendingCount(),
        hasPending: firebaseSync.hasPendingOperations()
    };
    
    if (status.configured) {
        try {
            // Teste de conexão simples
            await firebaseService.getCollection('_test', [], null, 'asc', 1);
            status.connected = true;
        } catch (error) {
            status.connected = false;
            status.error = error.message;
        }
    }
    
    return status;
}

// Executar diagnóstico automaticamente em desenvolvimento
if (import.meta.env.DEV) {
    // Aguardar um pouco para Firebase inicializar
    setTimeout(() => {
        // Primeiro verificar variáveis de ambiente
        const requiredVars = [
            'VITE_FIREBASE_API_KEY',
            'VITE_FIREBASE_AUTH_DOMAIN',
            'VITE_FIREBASE_PROJECT_ID',
            'VITE_FIREBASE_STORAGE_BUCKET',
            'VITE_FIREBASE_MESSAGING_SENDER_ID',
            'VITE_FIREBASE_APP_ID'
        ];
        
        const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
        
        const hasDefaultConfig = isFirebaseConfigured();

        if (missingVars.length > 0 && !hasDefaultConfig) {
            console.warn('⚠️ Variáveis de ambiente Firebase faltando:');
            missingVars.forEach(varName => {
                console.warn(`   - ${varName}`);
            });
            console.warn('📝 Verifique o arquivo .env.local na raiz do projeto');
            console.warn('💡 Execute: checkFirebaseEnv() no console para mais detalhes');
        } else {
            // Se todas as variáveis estão presentes, executar diagnóstico completo
            diagnoseFirebase().catch(error => {
                console.error('Erro ao executar diagnóstico:', error);
            });
        }
    }, 2000);
}


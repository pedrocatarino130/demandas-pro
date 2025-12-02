/**
 * Utilitário para Verificar Variáveis de Ambiente do Firebase
 * Verifica se todas as variáveis necessárias estão configuradas
 */

import { isFirebaseConfigured } from '../config/firebase.js';

/**
 * Verifica todas as variáveis de ambiente do Firebase
 * @returns {Object} Resultado da verificação
 */
export function checkFirebaseEnv() {
    console.group('🔍 Verificando Variáveis de Ambiente Firebase');

    // Se já estiver configurado (via arquivo/defaults), não precisamos checar env vars
    if (isFirebaseConfigured()) {
        console.log('✅ Firebase já configurado via arquivo/defaults. Variáveis VITE_* são opcionais.');
        console.groupEnd();
        return {};
    }

    const requiredVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
    ];
    
    let allPresent = true;
    const results = {};
    
    requiredVars.forEach(varName => {
        const value = import.meta.env[varName];
        const isPresent = !!value && typeof value === 'string' && value.trim() !== '';
        
        if (!isPresent) {
            allPresent = false;
        }
        
        results[varName] = {
            present: isPresent,
            value: isPresent && value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : undefined,
            length: value && typeof value === 'string' ? value.length : 0
        };
        
        if (isPresent && value) {
            const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
            console.log(`✅ ${varName}: ${displayValue} (${value.length} chars)`);
        } else {
            console.log(`❌ ${varName}: NÃO ENCONTRADO ou VAZIO`);
        }
    });
    
    console.groupEnd();
    
    // Se o Firebase já está configurado por arquivo ou default, não precisamos alertar
    const hasFallbackConfig = isFirebaseConfigured();
    
    if (allPresent || hasFallbackConfig) {
        if (!allPresent && hasFallbackConfig) {
            console.log('ℹ️ Variáveis VITE_* não estão setadas, mas o Firebase foi configurado via arquivo ou defaults. Prosseguindo.');
        } else {
            console.log('✅ Todas as variáveis estão presentes e preenchidas!');
            console.log('💡 Se ainda vê erro, verifique se os valores estão corretos.');
        }
    } else {
        console.error('❌ Algumas variáveis estão faltando ou vazias!');
        console.log('📝 Verifique:');
        console.log('1. Arquivo .env.local existe na raiz do projeto?');
        console.log('2. Nomes das variáveis começam com VITE_?');
        console.log('3. Todos os valores estão preenchidos (não vazios)?');
        console.log('4. Servidor foi reiniciado após criar/editar .env.local?');
        console.log('\n💡 Formato correto do .env.local:');
        console.log('   VITE_FIREBASE_API_KEY=valor');
        console.log('   VITE_FIREBASE_AUTH_DOMAIN=valor');
        console.log('   ... (sem espaços, sem aspas)');
    }
    
    return results;
}

// Executar automaticamente em desenvolvimento
if (import.meta.env.DEV) {
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(() => {
        checkFirebaseEnv();
    }, 1000);
}

// Exportar função globalmente para uso no console do navegador
try {
    if (typeof window !== 'undefined') {
        window.checkFirebaseEnv = checkFirebaseEnv;
    }
} catch (error) {
    // Ignorar erros se window não estiver disponível
}


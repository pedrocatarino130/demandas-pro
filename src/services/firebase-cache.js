/**
 * Gerenciamento de Cache Local usando IndexedDB
 * Cache local para armazenamento persistente de dados da aplicação
 * Fallback para localStorage caso IndexedDB não esteja disponível
 */

import { openDB } from 'idb';

const DB_NAME = 'gerenciador-pedro-cache';
const DB_VERSION = 1;
const STORE_NAME = 'app-data';
const STORAGE_PREFIX = 'gerenciador_cache_';

/**
 * Abre a conexão com IndexedDB
 */
async function openDatabase() {
    try {
        return await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    } catch (error) {
        console.warn('IndexedDB não disponível, usando localStorage como fallback:', error);
        return null;
    }
}

/**
 * Verifica se localStorage está disponível
 */
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Classe para gerenciar cache local
 */
class LocalCache {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.useLocalStorage = false;
    }

    /**
     * Inicializa o cache
     */
    async init() {
        if (this.initialized) return;
        try {
            // Tentar usar IndexedDB primeiro
            if (typeof window !== 'undefined' && 'indexedDB' in window) {
                try {
                    this.db = await openDatabase();
                    if (this.db) {
                        this.initialized = true;
                        this.useLocalStorage = false;
                        console.log('✅ Cache IndexedDB inicializado');
                        return;
                    }
                } catch (idbError) {
                    console.warn('IndexedDB falhou, tentando localStorage:', idbError);
                }
            }
            
            // Fallback para localStorage
            if (isLocalStorageAvailable()) {
                this.useLocalStorage = true;
                this.initialized = true;
                console.log('✅ Cache localStorage inicializado (fallback)');
            } else {
                console.warn('⚠️ Nenhum storage disponível');
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar cache:', error);
            // Tentar localStorage como último recurso
            if (isLocalStorageAvailable()) {
                this.useLocalStorage = true;
                this.initialized = true;
                console.log('✅ Cache localStorage inicializado (fallback após erro)');
            }
        }
    }

    /**
     * Salva dados no cache
     * @param {string} key - Chave do cache
     * @param {any} data - Dados para salvar
     */
    async set(key, data) {
        if (!this.initialized) await this.init();
        
        if (this.useLocalStorage) {
            try {
                const storageKey = `${STORAGE_PREFIX}${key}`;
                localStorage.setItem(storageKey, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(`Erro ao salvar no localStorage (${key}):`, error);
                return false;
            }
        }
        
        if (!this.db) return false;

        try {
            await this.db.put(STORE_NAME, data, key);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar no cache (${key}):`, error);
            // Tentar fallback para localStorage
            if (isLocalStorageAvailable()) {
                try {
                    const storageKey = `${STORAGE_PREFIX}${key}`;
                    localStorage.setItem(storageKey, JSON.stringify(data));
                    this.useLocalStorage = true;
                    return true;
                } catch (lsError) {
                    console.error(`Erro ao salvar no localStorage (fallback):`, lsError);
                }
            }
            return false;
        }
    }

    /**
     * Recupera dados do cache
     * @param {string} key - Chave do cache
     * @returns {Promise<any|null>} Dados ou null se não encontrado
     */
    async get(key) {
        if (!this.initialized) await this.init();
        
        if (this.useLocalStorage) {
            try {
                const storageKey = `${STORAGE_PREFIX}${key}`;
                const item = localStorage.getItem(storageKey);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error(`Erro ao recuperar do localStorage (${key}):`, error);
                return null;
            }
        }
        
        if (!this.db) return null;

        try {
            const result = await this.db.get(STORE_NAME, key);
            return result || null;
        } catch (error) {
            console.error(`Erro ao recuperar do cache (${key}):`, error);
            // Tentar fallback para localStorage
            if (isLocalStorageAvailable()) {
                try {
                    const storageKey = `${STORAGE_PREFIX}${key}`;
                    const item = localStorage.getItem(storageKey);
                    if (item) {
                        this.useLocalStorage = true;
                        return JSON.parse(item);
                    }
                } catch (lsError) {
                    console.error(`Erro ao recuperar do localStorage (fallback):`, lsError);
                }
            }
            return null;
        }
    }

    /**
     * Remove dados do cache
     * @param {string} key - Chave do cache
     */
    async remove(key) {
        if (!this.initialized) await this.init();
        
        if (this.useLocalStorage) {
            try {
                const storageKey = `${STORAGE_PREFIX}${key}`;
                localStorage.removeItem(storageKey);
                return true;
            } catch (error) {
                console.error(`Erro ao remover do localStorage (${key}):`, error);
                return false;
            }
        }
        
        if (!this.db) return false;

        try {
            await this.db.delete(STORE_NAME, key);
            return true;
        } catch (error) {
            console.error(`Erro ao remover do cache (${key}):`, error);
            // Tentar fallback para localStorage
            if (isLocalStorageAvailable()) {
                try {
                    const storageKey = `${STORAGE_PREFIX}${key}`;
                    localStorage.removeItem(storageKey);
                    return true;
                } catch (lsError) {
                    console.error(`Erro ao remover do localStorage (fallback):`, lsError);
                }
            }
            return false;
        }
    }

    /**
     * Limpa todo o cache
     */
    async clear() {
        if (!this.initialized) await this.init();
        
        if (this.useLocalStorage) {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith(STORAGE_PREFIX)) {
                        localStorage.removeItem(key);
                    }
                });
                return true;
            } catch (error) {
                console.error('Erro ao limpar localStorage:', error);
                return false;
            }
        }
        
        if (!this.db) return false;

        try {
            await this.db.clear(STORE_NAME);
            return true;
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
            return false;
        }
    }

    /**
     * Verifica se uma chave existe no cache
     * @param {string} key - Chave do cache
     * @returns {Promise<boolean>}
     */
    async has(key) {
        const data = await this.get(key);
        return data !== null;
    }

    /**
     * Obtém todas as chaves do cache
     * @returns {Promise<string[]>}
     */
    async getAllKeys() {
        if (!this.initialized) await this.init();
        
        if (this.useLocalStorage) {
            try {
                const keys = Object.keys(localStorage);
                return keys
                    .filter(key => key.startsWith(STORAGE_PREFIX))
                    .map(key => key.replace(STORAGE_PREFIX, ''));
            } catch (error) {
                console.error('Erro ao obter chaves do localStorage:', error);
                return [];
            }
        }
        
        if (!this.db) return [];

        try {
            return await this.db.getAllKeys(STORE_NAME);
        } catch (error) {
            console.error('Erro ao obter chaves do cache:', error);
            return [];
        }
    }
}

// Exportar instância singleton (mantém nome firebaseCache para compatibilidade)
export const firebaseCache = new LocalCache();
export default firebaseCache;


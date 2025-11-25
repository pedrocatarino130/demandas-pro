/**
 * Gerenciamento de Cache Local usando IndexedDB
 * Cache híbrido para suporte offline e performance
 */

import { openDB } from 'idb';

const DB_NAME = 'gerenciador-pedro-cache';
const DB_VERSION = 1;
const STORE_NAME = 'app-data';

/**
 * Abre a conexão com IndexedDB
 */
async function openDatabase() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

/**
 * Classe para gerenciar cache local
 */
class FirebaseCache {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    /**
     * Inicializa o cache
     */
    async init() {
        if (this.initialized) return;
        try {
            this.db = await openDatabase();
            this.initialized = true;
            console.log('✅ Cache IndexedDB inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar cache:', error);
        }
    }

    /**
     * Salva dados no cache
     * @param {string} key - Chave do cache
     * @param {any} data - Dados para salvar
     */
    async set(key, data) {
        if (!this.initialized) await this.init();
        if (!this.db) return false;

        try {
            await this.db.put(STORE_NAME, data, key);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar no cache (${key}):`, error);
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
        if (!this.db) return null;

        try {
            return await this.db.get(STORE_NAME, key) || null;
        } catch (error) {
            console.error(`Erro ao recuperar do cache (${key}):`, error);
            return null;
        }
    }

    /**
     * Remove dados do cache
     * @param {string} key - Chave do cache
     */
    async remove(key) {
        if (!this.initialized) await this.init();
        if (!this.db) return false;

        try {
            await this.db.delete(STORE_NAME, key);
            return true;
        } catch (error) {
            console.error(`Erro ao remover do cache (${key}):`, error);
            return false;
        }
    }

    /**
     * Limpa todo o cache
     */
    async clear() {
        if (!this.initialized) await this.init();
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
        if (!this.db) return [];

        try {
            return await this.db.getAllKeys(STORE_NAME);
        } catch (error) {
            console.error('Erro ao obter chaves do cache:', error);
            return [];
        }
    }
}

// Exportar instância singleton
export const firebaseCache = new FirebaseCache();
export default firebaseCache;


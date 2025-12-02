/**
 * Gerenciamento de Cache Local usando IndexedDB
 * Cache local para armazenamento persistente de dados da aplicação
 * Fallback para localStorage caso IndexedDB não esteja disponível
 */

import { openDB } from 'idb';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

const DB_NAME = 'gerenciador-pedro-cache';
const DB_VERSION = 1;
const STORE_NAME = 'app-data';
const STORAGE_PREFIX = 'gerenciador_cache_';
const DEFAULT_COMPRESS_THRESHOLD = 1024; // 1KB
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_YEAR_MS = 365 * ONE_DAY_MS;
const LAST_CLEANUP_KEY = `${STORAGE_PREFIX}last_cleanup`;

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
        this.defaultTTL = null; // TTL opcional por chave
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
                        await this._maybeCleanup();
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
            await this._maybeCleanup();
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
     * Cria payload padronizado com metadados (compressão/TTL)
     */
    _buildPayload(data, options = {}) {
        const { ttlMs, compress = false, compressThreshold = DEFAULT_COMPRESS_THRESHOLD } = options;
        const now = Date.now();
        let serialized = '';
        try {
            serialized = JSON.stringify(data);
        } catch (error) {
            console.warn('Não foi possível serializar dados para compressão:', error);
        }
        const shouldCompress = compress || (serialized?.length || 0) > compressThreshold;

        let value = data;
        let compressed = false;

        if (shouldCompress && serialized) {
            value = compressToUTF16(serialized);
            compressed = true;
        }

        return {
            __meta: {
                version: 1,
                compressed,
                createdAt: now,
                expiresAt: ttlMs ? now + ttlMs : null,
                size: serialized?.length || 0
            },
            value
        };
    }

    /**
     * Desempacota payload restaurando compressão/TTL
     */
    _unpackPayload(payload, { maxAgeMs } = {}) {
        if (!payload || payload.__meta === undefined) {
            return {
                expired: false,
                value: payload,
                meta: null
            };
        }

        const { __meta, value } = payload;
        const now = Date.now();

        if ((__meta.expiresAt && __meta.expiresAt < now) || (maxAgeMs && __meta.createdAt && now - __meta.createdAt > maxAgeMs)) {
            return { expired: true, value: null, meta: __meta };
        }

        if (__meta.compressed) {
            try {
                const decompressed = decompressFromUTF16(value);
                return {
                    expired: false,
                    value: JSON.parse(decompressed),
                    meta: __meta
                };
            } catch (error) {
                console.error('Erro ao descomprimir payload do cache:', error);
                return { expired: true, value: null, meta: __meta };
            }
        }

        return { expired: false, value, meta: __meta };
    }

    /**
     * Lê valor bruto do storage sem descompactar
     */
    async _readRaw(key) {
        if (!this.initialized) await this.init();

        if (this.useLocalStorage) {
            try {
                const storageKey = `${STORAGE_PREFIX}${key}`;
                const item = localStorage.getItem(storageKey);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error(`Erro ao recuperar bruto do localStorage (${key}):`, error);
                return null;
            }
        }

        if (!this.db) return null;

        try {
            return await this.db.get(STORE_NAME, key);
        } catch (error) {
            console.error(`Erro ao recuperar bruto do cache (${key}):`, error);
            return null;
        }
    }

    /**
     * Salva dados no cache
     * @param {string} key - Chave do cache
     * @param {any} data - Dados para salvar
     */
    async set(key, data) {
        return this.setWithOptions(key, data, {});
    }

    /**
     * Salva dados com opções de TTL e compressão
     * @param {string} key
     * @param {any} data
     * @param {Object} options
     * @param {number|null} options.ttlMs - expiração em ms
     * @param {boolean} options.compress - força compressão
     * @param {number} options.compressThreshold - tamanho mínimo para comprimir
     */
    async setWithOptions(key, data, options = {}) {
        if (!this.initialized) await this.init();
        
        const payload = this._buildPayload(data, {
            ...options,
            ttlMs: options.ttlMs ?? this.defaultTTL
        });

        if (this.useLocalStorage) {
            try {
                const storageKey = `${STORAGE_PREFIX}${key}`;
                localStorage.setItem(storageKey, JSON.stringify(payload));
                return true;
            } catch (error) {
                console.error(`Erro ao salvar no localStorage (${key}):`, error);
                return false;
            }
        }
        
        if (!this.db) return false;

        try {
            await this.db.put(STORE_NAME, payload, key);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar no cache (${key}):`, error);
            // Tentar fallback para localStorage
            if (isLocalStorageAvailable()) {
                try {
                    const storageKey = `${STORAGE_PREFIX}${key}`;
                    localStorage.setItem(storageKey, JSON.stringify(payload));
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
        
        const raw = await this._readRaw(key);
        const { expired, value } = this._unpackPayload(raw);

        if (expired) {
            await this.remove(key);
            return null;
        }

        return value;
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

    /**
     * Limpa dados antigos (>= 1 ano por padrão) e TTL expirados
     */
    async cleanOldData(maxAgeMs = ONE_YEAR_MS) {
        if (!this.initialized) await this.init();
        const keys = await this.getAllKeys();
        let removed = 0;

        for (const key of keys) {
            const raw = await this._readRaw(key);
            const { expired, meta } = this._unpackPayload(raw, { maxAgeMs });

            if (expired || (meta?.createdAt && Date.now() - meta.createdAt > maxAgeMs)) {
                await this.remove(key);
                removed++;
            }
        }

        if (removed > 0) {
            console.log(`🧹 Cache: ${removed} entradas antigas removidas`);
        }
    }

    /**
     * Estima uso de armazenamento local
     */
    async estimateUsage() {
        const keys = await this.getAllKeys();
        let totalBytes = 0;

        for (const key of keys) {
            const raw = await this._readRaw(key);
            if (raw?.__meta?.size) {
                totalBytes += raw.__meta.size;
            } else if (raw) {
                try {
                    totalBytes += JSON.stringify(raw).length;
                } catch (error) {
                    // ignora entradas não serializáveis
                }
            }
        }

        return {
            keys: keys.length,
            approxBytes: totalBytes
        };
    }

    async _maybeCleanup() {
        try {
            const lastCleanupRaw = localStorage.getItem(LAST_CLEANUP_KEY);
            const lastCleanup = lastCleanupRaw ? Number(lastCleanupRaw) : 0;
            if (!lastCleanup || Date.now() - lastCleanup > ONE_DAY_MS) {
                await this.cleanOldData();
                localStorage.setItem(LAST_CLEANUP_KEY, Date.now().toString());
            }
        } catch (error) {
            // se localStorage não estiver disponível, apenas ignora
            console.warn('Não foi possível registrar limpeza do cache:', error);
        }
    }
}

// Exportar instância singleton (mantém nome firebaseCache para compatibilidade)
export const firebaseCache = new LocalCache();
export default firebaseCache;


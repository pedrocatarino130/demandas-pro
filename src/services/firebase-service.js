/**
 * Serviço Firebase - Implementação Real
 * Gerencia operações CRUD e listeners real-time com Firestore
 */

import { app, auth as firebaseAuth, db as firebaseDb, initializeFirebase, isFirebaseConfigured } from '../config/firebase.js';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    getDocs,
    where,
    orderBy,
    limit as firestoreLimit,
    writeBatch,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

const USER_ID = 'default'; // Single-user MVP

class FirebaseService {
    constructor() {
        this.db = firebaseDb;
        this.auth = firebaseAuth;
        this.listeners = new Map();
        this.available = Boolean(this.db);
        this.initializing = false;
        this.initPromise = null;

        if (this.available) {
            console.log('✅ Firebase Service disponível');
        } else {
            this._init().catch((err) => {
                console.warn('⚠️ Firebase Service não disponível - modo offline apenas', err?.message);
            });
        }
    }

    async _init() {
        if (this.initPromise) return this.initPromise;
        this.initializing = true;

        this.initPromise = initializeFirebase()
            .then(() => {
                this.db = firebaseDb;
                this.auth = firebaseAuth;
                this.available = Boolean(this.db);
                if (this.available) {
                    console.log('✅ Firebase Service inicializado');
                } else {
                    console.warn('⚠️ Firebase Service segue indisponível (sem db)');
                }
                return this.available;
            })
            .catch((error) => {
                this.available = false;
                console.warn('⚠️ Erro ao inicializar Firebase Service:', error?.message || error);
                return false;
            })
            .finally(() => {
                this.initializing = false;
            });

        return this.initPromise;
    }

    async ensureReady() {
        if (this.available) return true;
        if (!isFirebaseConfigured()) return false;
        await this._init();
        return this.available;
    }

    /**
     * Verifica se Firebase está disponível
     * @returns {boolean}
     */
    isAvailable() {
        return this.available && this.db !== null;
    }

    /**
     * Obtém caminho da coleção para o usuário
     * @param {string} collectionName - Nome da coleção
     * @returns {CollectionReference}
     */
    _getCollectionPath(collectionName) {
        if (!this.isAvailable()) return null;

        const safeCollection = this._normalizePathSegment(collectionName);
        if (!safeCollection) {
            console.warn('⚠️ Nome de coleção inválido para Firebase:', collectionName);
            return null;
        }

        return collection(this.db, 'users', USER_ID, safeCollection);
    }

    /**
     * Obtém referência do documento
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @returns {DocumentReference}
     */
    _getDocRef(collectionName, docId) {
        if (!this.isAvailable()) return null;

        const safeCollection = this._normalizePathSegment(collectionName);
        const safeDocId = this._normalizePathSegment(docId);

        if (!safeCollection || !safeDocId) {
            console.warn('⚠️ Referência inválida para Firebase:', { collectionName, docId });
            return null;
        }

        return doc(this.db, 'users', USER_ID, safeCollection, safeDocId);
    }

    /**
     * Normaliza segmentos de path para strings válidas
     * @param {string|number} value
     * @returns {string|null}
     */
    _normalizePathSegment(value) {
        if (value === undefined || value === null) return null;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        if (typeof value === 'number' || typeof value === 'bigint') {
            return String(value);
        }
        if (typeof value === 'object' && typeof value.toString === 'function') {
            const converted = value.toString().trim();
            return converted.length > 0 ? converted : null;
        }
        return null;
    }

    /**
     * Busca um documento
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @returns {Promise<Object|null>}
     */
    async getDocument(collectionName, docId) {
        if (!(await this.ensureReady())) return null;

        try {
            const docRef = this._getDocRef(collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            }
            return null;
        } catch (error) {
            // Se estiver offline, retornar null silenciosamente (não é erro crítico)
            if (error.code === 'unavailable' || 
                error.message?.includes('offline') || 
                error.message?.includes('Failed to get document because the client is offline')) {
                // Log apenas em modo debug, não como erro crítico
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Cliente offline - não foi possível buscar documento ${collectionName}/${docId}`);
                }
                return null;
            }
            // Para outros erros, logar e lançar
            console.error(`Erro ao buscar documento ${collectionName}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Busca uma coleção com filtros e ordenação
     * @param {string} collectionName - Nome da coleção
     * @param {Array} filters - Array de filtros [{field, operator, value}]
     * @param {string} orderByField - Campo para ordenação
     * @param {string} orderDirection - Direção da ordenação ('asc' | 'desc')
     * @param {number} limit - Limite de resultados (opcional)
     * @returns {Promise<Array>}
     */
    async getCollection(collectionName, filters = [], orderByField = null, orderDirection = 'asc', limit = null) {
        if (!(await this.ensureReady())) return [];

        try {
            const collectionRef = this._getCollectionPath(collectionName);
            if (!collectionRef) return [];

            let q = query(collectionRef);

            // Aplicar filtros
            filters.forEach(filter => {
                q = query(q, where(filter.field, filter.operator, filter.value));
            });

            // Aplicar ordenação
            if (orderByField) {
                q = query(q, orderBy(orderByField, orderDirection));
            }

            // Aplicar limite
            if (limit) {
                q = query(q, firestoreLimit(limit));
            }

            const querySnapshot = await getDocs(q);
            const results = [];

            querySnapshot.forEach((docSnap) => {
                results.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });

            return results;
        } catch (error) {
            // Se estiver offline, retornar array vazio silenciosamente (não é erro crítico)
            if (error.code === 'unavailable' || 
                error.message?.includes('offline') || 
                error.message?.includes('Failed to get document because the client is offline')) {
                // Log apenas em modo debug, não como erro crítico
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Cliente offline - não foi possível buscar coleção ${collectionName}`);
                }
                return [];
            }
            // Para outros erros, logar e lançar
            console.error(`Erro ao buscar coleção ${collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Cria ou atualiza um documento
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @param {Object} data - Dados do documento
     * @param {boolean} merge - Se true, faz merge; se false, sobrescreve
     * @returns {Promise<string>} ID do documento
     */
    async setDocument(collectionName, docId, data, merge = true) {
        if (!(await this.ensureReady())) return docId || null;

        try {
            const docRef = this._getDocRef(collectionName, docId || this._generateId());
            
            const docData = {
                ...data,
                _lastModified: serverTimestamp(),
                _userId: USER_ID
            };

            await setDoc(docRef, docData, { merge });
            return docRef.id;
        } catch (error) {
            console.error(`Erro ao salvar documento ${collectionName}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza campos específicos de um documento
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @param {Object} updates - Campos a atualizar
     * @returns {Promise<string>} ID do documento
     */
    async updateDocument(collectionName, docId, updates) {
        if (!(await this.ensureReady())) return docId || null;

        try {
            const docRef = this._getDocRef(collectionName, docId);
            
            const updateData = {
                ...updates,
                _lastModified: serverTimestamp()
            };

            await updateDoc(docRef, updateData);
            return docId;
        } catch (error) {
            console.error(`Erro ao atualizar documento ${collectionName}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Deleta um documento
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @returns {Promise<void>}
     */
    async deleteDocument(collectionName, docId) {
        if (!(await this.ensureReady())) return;

        try {
            const docRef = this._getDocRef(collectionName, docId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Erro ao deletar documento ${collectionName}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Executa múltiplas operações em lote
     * @param {Array} operations - Array de operações [{type, collection, docId, data}]
     * @returns {Promise<void>}
     */
    async batchWrite(operations) {
        if (!(await this.ensureReady()) || !operations || operations.length === 0) return;

        try {
            const batch = writeBatch(this.db);
            const BATCH_LIMIT = 500; // Limite do Firestore

            for (let i = 0; i < operations.length; i += BATCH_LIMIT) {
                const batchOps = operations.slice(i, i + BATCH_LIMIT);
                const currentBatch = writeBatch(this.db);

                batchOps.forEach(op => {
                    const docRef = this._getDocRef(op.collection, op.docId || this._generateId());
                    const docData = {
                        ...op.data,
                        _lastModified: serverTimestamp(),
                        _userId: USER_ID
                    };

                    switch (op.type) {
                        case 'SET':
                            currentBatch.set(docRef, docData, { merge: op.merge !== false });
                            break;
                        case 'UPDATE':
                            currentBatch.update(docRef, docData);
                            break;
                        case 'DELETE':
                            currentBatch.delete(docRef);
                            break;
                        default:
                            console.warn(`Tipo de operação desconhecido: ${op.type}`);
                    }
                });

                await currentBatch.commit();
            }
        } catch (error) {
            console.error('Erro ao executar batch write:', error);
            throw error;
        }
    }

    /**
     * Inscreve-se em mudanças de um documento (real-time)
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @param {Function} callback - Função callback(doc) chamada quando há mudanças
     * @returns {Function} Função para cancelar a inscrição
     */
    subscribeToDocument(collectionName, docId, callback) {
        if (!this.isAvailable()) {
            this.ensureReady().catch(() => {});
            return () => {}; // Retorna função vazia se não disponível
        }

        try {
            const docRef = this._getDocRef(collectionName, docId);
            const listenerId = `${collectionName}/${docId}`;

            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    callback({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                } else {
                    callback(null);
                }
            }, (error) => {
                console.error(`Erro no listener de documento ${collectionName}/${docId}:`, error);
            });

            // Armazenar unsubscribe function
            this.listeners.set(listenerId, unsubscribe);

            // Retornar função para cancelar
            return () => {
                unsubscribe();
                this.listeners.delete(listenerId);
            };
        } catch (error) {
            console.error(`Erro ao inscrever-se em documento ${collectionName}/${docId}:`, error);
            return () => {};
        }
    }

    /**
     * Inscreve-se em mudanças de uma coleção (real-time)
     * @param {string} collectionName - Nome da coleção
     * @param {Function} callback - Função callback(docs) chamada quando há mudanças
     * @param {Array} filters - Array de filtros opcionais
     * @returns {Function} Função para cancelar a inscrição
     */
    subscribeToCollection(collectionName, callback, filters = []) {
        if (!this.isAvailable()) {
            this.ensureReady().catch(() => {});
            return () => {}; // Retorna função vazia se não disponível
        }

        try {
            const collectionRef = this._getCollectionPath(collectionName);
            if (!collectionRef) return () => {};

            let q = query(collectionRef);

            // Aplicar filtros
            filters.forEach(filter => {
                q = query(q, where(filter.field, filter.operator, filter.value));
            });

            const listenerId = `collection/${collectionName}`;

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const docs = [];
                querySnapshot.forEach((docSnap) => {
                    docs.push({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                });
                callback(docs);
            }, (error) => {
                console.error(`Erro no listener de coleção ${collectionName}:`, error);
            });

            // Armazenar unsubscribe function
            this.listeners.set(listenerId, unsubscribe);

            // Retornar função para cancelar
            return () => {
                unsubscribe();
                this.listeners.delete(listenerId);
            };
        } catch (error) {
            console.error(`Erro ao inscrever-se em coleção ${collectionName}:`, error);
            return () => {};
        }
    }

    /**
     * Cancela todas as inscrições ativas
     */
    unsubscribeAll() {
        this.listeners.forEach((unsubscribe) => {
            try {
                unsubscribe();
            } catch (error) {
                console.error('Erro ao cancelar listener:', error);
            }
        });
        this.listeners.clear();
    }

    /**
     * Gera um ID único para documentos
     * Usa a função do Firestore para gerar ID único
     * @returns {string}
     */
    _generateId() {
        if (!this.isAvailable()) {
            // Fallback: gerar ID simples se Firebase não disponível
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        // Usar collection temporária apenas para gerar ID
        const tempRef = collection(this.db, '_temp');
        return doc(tempRef).id;
    }
}

// Exportar instância singleton
export const firebaseService = new FirebaseService();
export default firebaseService;

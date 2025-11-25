/**
 * Serviço Principal do Firebase
 * Abstrai operações CRUD do Firestore com cache local e sincronização
 */

import { db } from '../config/firebase.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    writeBatch,
    serverTimestamp,
} from 'firebase/firestore';
import { firebaseCache } from './firebase-cache.js';
import { firebaseSync } from './firebase-sync.js';

/**
 * Classe principal do serviço Firebase
 */
class FirebaseService {
    constructor() {
        this.db = db;
        this.listeners = new Map(); // Armazenar listeners ativos
        this.cachePrefix = 'firestore-';
    }

    /**
     * Verifica se o Firestore está disponível
     */
    isAvailable() {
        return this.db !== null;
    }

    /**
     * Obtém uma referência para uma coleção
     */
    getCollectionRef(collectionName) {
        if (!this.isAvailable()) {
            throw new Error('Firestore não está disponível');
        }
        return collection(this.db, collectionName);
    }

    /**
     * Obtém uma referência para um documento
     */
    getDocumentRef(collectionName, docId) {
        if (!this.isAvailable()) {
            throw new Error('Firestore não está disponível');
        }
        return doc(this.db, collectionName, docId);
    }

    /**
     * Obtém chave de cache para um documento
     */
    getCacheKey(collectionName, docId) {
        return `${this.cachePrefix}${collectionName}/${docId}`;
    }

    /**
     * Lê um documento do Firestore com cache
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento
     * @returns {Promise<any|null>} Dados do documento ou null
     */
    async getDocument(collectionName, docId) {
        const cacheKey = this.getCacheKey(collectionName, docId);

        try {
            // Tentar ler do Firestore
            if (this.isAvailable() && firebaseSync.getOnlineStatus()) {
                const docRef = this.getDocumentRef(collectionName, docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = {
                        id: docSnap.id,
                        ...docSnap.data(),
                    };
                    // Atualizar cache
                    await firebaseCache.set(cacheKey, data);
                    return data;
                }
            }
        } catch (error) {
            console.warn(`Erro ao ler documento do Firestore (${collectionName}/${docId}):`, error);
        }

        // Fallback para cache
        return await firebaseCache.get(cacheKey);
    }

    /**
     * Lê todos os documentos de uma coleção
     * @param {string} collectionName - Nome da coleção
     * @param {Array} filters - Filtros opcionais [{field, operator, value}]
     * @param {string} orderByField - Campo para ordenação
     * @param {string} orderDirection - Direção da ordenação ('asc' ou 'desc')
     * @returns {Promise<Array>} Array de documentos
     */
    async getCollection(collectionName, filters = [], orderByField = null, orderDirection = 'asc') {
        try {
            if (this.isAvailable() && firebaseSync.getOnlineStatus()) {
                let q = this.getCollectionRef(collectionName);

                // Aplicar filtros
                filters.forEach(filter => {
                    q = query(q, where(filter.field, filter.operator, filter.value));
                });

                // Aplicar ordenação
                if (orderByField) {
                    q = query(q, orderBy(orderByField, orderDirection));
                }

                const querySnapshot = await getDocs(q);
                const documents = [];

                querySnapshot.forEach((docSnap) => {
                    documents.push({
                        id: docSnap.id,
                        ...docSnap.data(),
                    });
                });

                // Atualizar cache da coleção inteira
                const cacheKey = `${this.cachePrefix}collection-${collectionName}`;
                await firebaseCache.set(cacheKey, documents);

                return documents;
            }
        } catch (error) {
            console.warn(`Erro ao ler coleção do Firestore (${collectionName}):`, error);
        }

        // Fallback para cache
        const cacheKey = `${this.cachePrefix}collection-${collectionName}`;
        const cached = await firebaseCache.get(cacheKey);
        return cached || [];
    }

    /**
     * Cria ou atualiza um documento
     * @param {string} collectionName - Nome da coleção
     * @param {string} docId - ID do documento (opcional, será gerado se não fornecido)
     * @param {Object} data - Dados do documento
     * @param {boolean} merge - Se true, faz merge com dados existentes
     * @returns {Promise<string>} ID do documento
     */
    async setDocument(collectionName, docId, data, merge = true) {
        const cacheKey = this.getCacheKey(collectionName, docId);

        // Atualizar cache imediatamente
        const documentData = {
            ...data,
            updatedAt: new Date().toISOString(),
        };
        await firebaseCache.set(cacheKey, documentData);

        // Se estiver offline, adicionar à fila de sincronização
        if (!firebaseSync.getOnlineStatus()) {
            await firebaseSync.addToQueue({
                type: 'set',
                collection: collectionName,
                docId,
                data: documentData,
                merge,
                execute: async () => {
                    return this._executeSetDocument(collectionName, docId, documentData, merge);
                },
            });
            return docId;
        }

        // Se estiver online, salvar imediatamente
        try {
            return await this._executeSetDocument(collectionName, docId, documentData, merge);
        } catch (error) {
            console.error(`Erro ao salvar documento no Firestore (${collectionName}/${docId}):`, error);
            // Adicionar à fila mesmo se falhar
            await firebaseSync.addToQueue({
                type: 'set',
                collection: collectionName,
                docId,
                data: documentData,
                merge,
                execute: async () => {
                    return this._executeSetDocument(collectionName, docId, documentData, merge);
                },
            });
            throw error;
        }
    }

    /**
     * Executa a operação de set no Firestore
     */
    async _executeSetDocument(collectionName, docId, data, merge) {
        if (!this.isAvailable()) {
            throw new Error('Firestore não está disponível');
        }

        // Remover campo id se existir (é metadado do Firestore)
        const { id, ...firestoreData } = data;

        if (docId) {
            const docRef = this.getDocumentRef(collectionName, docId);
            await setDoc(docRef, {
                ...firestoreData,
                updatedAt: serverTimestamp(),
            }, { merge });
            return docId;
        } else {
            const collectionRef = this.getCollectionRef(collectionName);
            const docRef = await addDoc(collectionRef, {
                ...firestoreData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        }
    }

    /**
     * Atualiza um documento existente
     */
    async updateDocument(collectionName, docId, updates) {
        return this.setDocument(collectionName, docId, updates, true);
    }

    /**
     * Deleta um documento
     */
    async deleteDocument(collectionName, docId) {
        const cacheKey = this.getCacheKey(collectionName, docId);

        // Remover do cache imediatamente
        await firebaseCache.remove(cacheKey);

        // Se estiver offline, adicionar à fila
        if (!firebaseSync.getOnlineStatus()) {
            await firebaseSync.addToQueue({
                type: 'delete',
                collection: collectionName,
                docId,
                execute: async () => {
                    return this._executeDeleteDocument(collectionName, docId);
                },
            });
            return;
        }

        // Se estiver online, deletar imediatamente
        try {
            await this._executeDeleteDocument(collectionName, docId);
        } catch (error) {
            console.error(`Erro ao deletar documento do Firestore (${collectionName}/${docId}):`, error);
            await firebaseSync.addToQueue({
                type: 'delete',
                collection: collectionName,
                docId,
                execute: async () => {
                    return this._executeDeleteDocument(collectionName, docId);
                },
            });
            throw error;
        }
    }

    /**
     * Executa a operação de delete no Firestore
     */
    async _executeDeleteDocument(collectionName, docId) {
        if (!this.isAvailable()) {
            throw new Error('Firestore não está disponível');
        }

        const docRef = this.getDocumentRef(collectionName, docId);
        await deleteDoc(docRef);
    }

    /**
     * Salva múltiplos documentos em uma única transação
     */
    async batchWrite(operations) {
        if (!this.isAvailable()) {
            throw new Error('Firestore não está disponível');
        }

        const batch = writeBatch(this.db);

        for (const op of operations) {
            const docRef = this.getDocumentRef(op.collection, op.docId);

            switch (op.type) {
                case 'set':
                    batch.set(docRef, {
                        ...op.data,
                        updatedAt: serverTimestamp(),
                    }, { merge: op.merge || false });
                    break;
                case 'update':
                    batch.update(docRef, {
                        ...op.data,
                        updatedAt: serverTimestamp(),
                    });
                    break;
                case 'delete':
                    batch.delete(docRef);
                    break;
            }
        }

        await batch.commit();
    }

    /**
     * Escuta mudanças em tempo real em um documento
     */
    subscribeToDocument(collectionName, docId, callback) {
        if (!this.isAvailable()) {
            // Usar cache como fallback
            const cacheKey = this.getCacheKey(collectionName, docId);
            firebaseCache.get(cacheKey).then(callback);
            return () => {};
        }

        const docRef = this.getDocumentRef(collectionName, docId);
        const listenerKey = `${collectionName}/${docId}`;

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                const data = docSnap.exists() ? {
                    id: docSnap.id,
                    ...docSnap.data(),
                } : null;

                // Atualizar cache
                if (data) {
                    const cacheKey = this.getCacheKey(collectionName, docId);
                    firebaseCache.set(cacheKey, data);
                }

                callback(data);
            },
            (error) => {
                console.error(`Erro ao escutar documento (${collectionName}/${docId}):`, error);
            }
        );

        this.listeners.set(listenerKey, unsubscribe);

        return () => {
            unsubscribe();
            this.listeners.delete(listenerKey);
        };
    }

    /**
     * Escuta mudanças em tempo real em uma coleção
     */
    subscribeToCollection(collectionName, callback, filters = []) {
        if (!this.isAvailable()) {
            // Usar cache como fallback
            const cacheKey = `${this.cachePrefix}collection-${collectionName}`;
            firebaseCache.get(cacheKey).then(data => callback(data || []));
            return () => {};
        }

        let q = this.getCollectionRef(collectionName);

        filters.forEach(filter => {
            q = query(q, where(filter.field, filter.operator, filter.value));
        });

        const listenerKey = `collection-${collectionName}`;

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const documents = [];
                querySnapshot.forEach((docSnap) => {
                    documents.push({
                        id: docSnap.id,
                        ...docSnap.data(),
                    });
                });

                // Atualizar cache
                const cacheKey = `${this.cachePrefix}collection-${collectionName}`;
                firebaseCache.set(cacheKey, documents);

                callback(documents);
            },
            (error) => {
                console.error(`Erro ao escutar coleção (${collectionName}):`, error);
            }
        );

        this.listeners.set(listenerKey, unsubscribe);

        return () => {
            unsubscribe();
            this.listeners.delete(listenerKey);
        };
    }

    /**
     * Remove todos os listeners
     */
    unsubscribeAll() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners.clear();
    }
}

// Exportar instância singleton
export const firebaseService = new FirebaseService();
export default firebaseService;


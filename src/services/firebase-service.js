/**
 * Serviço Firebase - STUB LOCAL
 * Todos os métodos retornam valores vazios ou não fazem nada.
 * O sistema agora funciona apenas com armazenamento local.
 */

class FirebaseService {
    constructor() {
        this.db = null;
        this.listeners = new Map();
    }

    /**
     * Sempre retorna false - Firebase não está disponível
     */
    isAvailable() {
        return false;
    }

    /**
     * Stub methods - não fazem nada
     */
    async getDocument(collectionName, docId) {
        return null;
    }

    async getCollection(collectionName, filters = [], orderByField = null, orderDirection = 'asc') {
        return [];
    }

    async setDocument(collectionName, docId, data, merge = true) {
        return docId || null;
    }

    async updateDocument(collectionName, docId, updates) {
        return docId || null;
    }

    async deleteDocument(collectionName, docId) {
        // Não faz nada
    }

    async batchWrite(operations) {
        // Não faz nada
    }

    subscribeToDocument(collectionName, docId, callback) {
        // Retorna função vazia de unsubscribe
        return () => {};
    }

    subscribeToCollection(collectionName, callback, filters = []) {
        // Retorna função vazia de unsubscribe
        return () => {};
    }

    unsubscribeAll() {
        // Não faz nada
    }
}

// Exportar instância singleton
export const firebaseService = new FirebaseService();
export default firebaseService;

/**
 * Seed automatizado do Firestore (coleções e docs mínimos) via REST API
 * Usa API Key pública (regras já permitem acesso em users/default/**).
 * Requer Node 18+ (fetch nativo). Em Windows, o comando npm já usa cross-env.
 * Uso: npm run seed:firestore
 */

const PROJECT_ID = 'organizacao-pedro';
const API_KEY = 'AIzaSyD2H2jclybwrMfZ4qPjJCNb3umlk7aM2M8';

const collections = {
    tarefas: [{
        id: 'demo',
        titulo: 'Tarefa demo',
        status: 'todo',
        descricao: 'Criada pelo seed',
        _lastModified: new Date().toISOString()
    }],
    tarefasRotina: [{
        id: 'rotina1',
        titulo: 'Rotina demo',
        status: 'todo',
        _lastModified: new Date().toISOString()
    }],
    historico: [{
        id: 'hist1',
        descricao: 'Entrada de histórico demo',
        dataExecucao: new Date().toISOString(),
        _lastModified: new Date().toISOString()
    }],
    categorias: [{
        id: 'cat1',
        nome: 'Pessoal',
        _lastModified: new Date().toISOString()
    }],
    areasEstudo: [{
        id: 'area1',
        nome: 'Matemática',
        _lastModified: new Date().toISOString()
    }],
    topicosEstudo: [{
        id: 'topico1',
        nome: 'Álgebra',
        _lastModified: new Date().toISOString()
    }],
    sessoesEstudo: [{
        id: 'sessao1',
        nome: 'Sessão demo',
        duracao: 25,
        _lastModified: new Date().toISOString()
    }],
    tagsEstudo: [{
        id: 'tag1',
        nome: 'Revisão',
        _lastModified: new Date().toISOString()
    }],
    avaliacoesDiarias: [{
        id: 'aval1',
        data: new Date().toISOString().slice(0, 10),
        nota: 5,
        _lastModified: new Date().toISOString()
    }],
    configEstudos: [{
        id: 'default',
        revisaoEspacada: { ativo: true, intervalos: [7, 15, 30] },
        notificacoes: true,
        viewPadrao: 'kanban',
        _lastModified: new Date().toISOString()
    }]
};

function toValue(val) {
    if (val === null) return { nullValue: null };
    if (val === undefined) return { nullValue: null };
    if (typeof val === 'string') return { stringValue: val };
    if (typeof val === 'number') {
        return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
    }
    if (typeof val === 'boolean') return { booleanValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toValue) } };
    if (typeof val === 'object') {
        const fields = {};
        Object.entries(val).forEach(([k, v]) => {
            if (v !== undefined) {
                fields[k] = toValue(v);
            }
        });
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

async function writeDoc(path, data) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}?key=${API_KEY}`;
    const body = {
        fields: {}
    };
    Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined) {
            body.fields[k] = toValue(v);
        }
    });

    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Falha ao gravar ${path}: ${res.status} ${text}`);
    }
}

async function seed() {
    let created = 0;
    for (const [collectionName, docs] of Object.entries(collections)) {
        for (const data of docs) {
            const docId = data.id || 'auto';
            const path = `users/default/${collectionName}/${docId}`;
            await writeDoc(path, data);
            created += 1;
            console.log(`✅ ${path} criado/atualizado`);
        }
    }
    console.log(`🎉 Seed concluído: ${created} documentos criados/atualizados.`);
}

seed().catch((err) => {
    console.error('❌ Erro ao rodar seed:', err?.message || err);
    process.exit(1);
});

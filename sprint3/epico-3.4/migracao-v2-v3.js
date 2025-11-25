/**
 * TASK-023: Script de Migração v2 → v3
 * 
 * Descrição: Converter dados do formato antigo para o novo
 * Estimativa: M (6h)
 * Dependências: TASK-003 (Sistema de Estado Global)
 * 
 * Critérios de Aceitação:
 * - Backup automático antes de migrar
 * - Mapear estrutura antiga → nova
 * - Validação de integridade
 * - Rollback se falhar
 * - Log detalhado do processo
 * - Interface para executar migração manualmente
 */

/**
 * Chaves do localStorage v2
 */
const V2_KEYS = {
    PROJETOS: 'tarefas_projetos_v2',
    ROTINA: 'tarefas_rotina_v5',
    HISTORICO: 'historico_rotina_v5',
    CATEGORIAS: 'categorias_rotina_v4',
    ESTUDOS: 'estudos_dados_v2',
    AVALIACOES: 'avaliacoes_diarias_v1',
};

/**
 * Chaves do localStorage v3
 */
const V3_KEYS = {
    STATE: 'gerenciador_v3_state',
    MIGRATED: 'gerenciador_v3_migrated',
    BACKUP: 'gerenciador_v2_backup',
    MIGRATION_LOG: 'gerenciador_v2_v3_migration_log',
};

/**
 * Log de migração
 */
class MigrationLog {
    constructor() {
        this.entries = [];
        this.startTime = null;
        this.endTime = null;
        this.success = false;
    }
    
    start() {
        this.startTime = new Date().toISOString();
        this.add('INICIADO', 'Migração v2 → v3 iniciada');
    }
    
    add(type, message, data = null) {
        const entry = {
            timestamp: new Date().toISOString(),
            type: type, // INFO, WARN, ERROR, SUCCESS
            message: message,
            data: data
        };
        this.entries.push(entry);
        console.log(`[${type}] ${message}`, data || '');
    }
    
    finish(success) {
        this.endTime = new Date().toISOString();
        this.success = success;
        const duration = new Date(this.endTime) - new Date(this.startTime);
        this.add(success ? 'SUCCESS' : 'ERROR', 
                `Migração ${success ? 'concluída' : 'falhou'} em ${duration}ms`);
    }
    
    save() {
        try {
            localStorage.setItem(V3_KEYS.MIGRATION_LOG, JSON.stringify(this));
        } catch (error) {
            console.error('Erro ao salvar log de migração:', error);
        }
    }
    
    static load() {
        try {
            const log = localStorage.getItem(V3_KEYS.MIGRATION_LOG);
            return log ? JSON.parse(log) : null;
        } catch (error) {
            return null;
        }
    }
}

/**
 * Cria backup de todos os dados v2
 */
function createBackup() {
    const backup = {
        timestamp: new Date().toISOString(),
        version: '2',
        data: {}
    };
    
    // Fazer backup de todas as chaves v2
    Object.entries(V2_KEYS).forEach(([name, key]) => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                backup.data[key] = JSON.parse(value);
            } catch (error) {
                backup.data[key] = value; // Salvar como string se não for JSON
            }
        }
    });
    
    // Salvar backup
    try {
        localStorage.setItem(V3_KEYS.BACKUP, JSON.stringify(backup));
        return backup;
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        throw new Error('Falha ao criar backup: ' + error.message);
    }
}

/**
 * Restaura backup
 */
function restoreBackup() {
    try {
        const backupStr = localStorage.getItem(V3_KEYS.BACKUP);
        if (!backupStr) {
            throw new Error('Backup não encontrado');
        }
        
        const backup = JSON.parse(backupStr);
        
        // Restaurar cada chave
        Object.entries(backup.data).forEach(([key, value]) => {
            if (typeof value === 'string') {
                localStorage.setItem(key, value);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        });
        
        return true;
    } catch (error) {
        console.error('Erro ao restaurar backup:', error);
        return false;
    }
}

/**
 * Valida estrutura de dados v2
 */
function validateV2Data(log) {
    log.add('INFO', 'Validando dados v2...');
    
    const validations = {
        projetos: false,
        rotina: false,
        estudos: false,
    };
    
    // Validar projetos
    const projetos = localStorage.getItem(V2_KEYS.PROJETOS);
    if (projetos) {
        try {
            const parsed = JSON.parse(projetos);
            validations.projetos = Array.isArray(parsed.tarefas) || Array.isArray(parsed);
            log.add('INFO', `Projetos: ${validations.projetos ? 'OK' : 'INVÁLIDO'}`);
        } catch (error) {
            log.add('WARN', 'Projetos não é JSON válido', error);
        }
    }
    
    // Validar rotina
    const rotina = localStorage.getItem(V2_KEYS.ROTINA);
    if (rotina) {
        try {
            const parsed = JSON.parse(rotina);
            validations.rotina = Array.isArray(parsed.tarefas) || Array.isArray(parsed);
            log.add('INFO', `Rotina: ${validations.rotina ? 'OK' : 'INVÁLIDO'}`);
        } catch (error) {
            log.add('WARN', 'Rotina não é JSON válido', error);
        }
    }
    
    // Validar estudos
    const estudos = localStorage.getItem(V2_KEYS.ESTUDOS);
    if (estudos) {
        try {
            const parsed = JSON.parse(estudos);
            validations.estudos = typeof parsed === 'object';
            log.add('INFO', `Estudos: ${validations.estudos ? 'OK' : 'INVÁLIDO'}`);
        } catch (error) {
            log.add('WARN', 'Estudos não é JSON válido', error);
        }
    }
    
    const allValid = Object.values(validations).some(v => v); // Pelo menos um válido
    log.add(allValid ? 'INFO' : 'WARN', 
            `Validação: ${allValid ? 'Dados encontrados' : 'Nenhum dado válido encontrado'}`);
    
    return allValid;
}

/**
 * Migra dados de projetos
 */
function migrateProjetos(log) {
    log.add('INFO', 'Migrando projetos...');
    
    try {
        const projetosStr = localStorage.getItem(V2_KEYS.PROJETOS);
        if (!projetosStr) {
            log.add('INFO', 'Nenhum dado de projetos encontrado');
            return { tarefas: [], contador: 0 };
        }
        
        const projetos = JSON.parse(projetosStr);
        
        // Se for objeto com tarefas e contador
        if (projetos.tarefas && Array.isArray(projetos.tarefas)) {
            log.add('INFO', `Migrando ${projetos.tarefas.length} tarefas de projetos`);
            return {
                tarefas: projetos.tarefas.map(migrateTask),
                contador: projetos.contador || 0
            };
        }
        
        // Se for array direto
        if (Array.isArray(projetos)) {
            log.add('INFO', `Migrando ${projetos.length} tarefas de projetos`);
            return {
                tarefas: projetos.map(migrateTask),
                contador: projetos.length
            };
        }
        
        log.add('WARN', 'Formato de projetos desconhecido');
        return { tarefas: [], contador: 0 };
    } catch (error) {
        log.add('ERROR', 'Erro ao migrar projetos', error.message);
        throw error;
    }
}

/**
 * Migra dados de rotina
 */
function migrateRotina(log) {
    log.add('INFO', 'Migrando rotina...');
    
    try {
        const rotinaStr = localStorage.getItem(V2_KEYS.ROTINA);
        const historicoStr = localStorage.getItem(V2_KEYS.HISTORICO);
        const categoriasStr = localStorage.getItem(V2_KEYS.CATEGORIAS);
        
        const result = {
            tarefasRotina: [],
            contadorRotina: 0,
            historico: [],
            categorias: []
        };
        
        // Migrar tarefas de rotina
        if (rotinaStr) {
            const rotina = JSON.parse(rotinaStr);
            if (rotina.tarefas && Array.isArray(rotina.tarefas)) {
                result.tarefasRotina = rotina.tarefas.map(migrateRotinaTask);
                result.contadorRotina = rotina.contador || rotina.tarefas.length;
                log.add('INFO', `Migrando ${result.tarefasRotina.length} tarefas de rotina`);
            }
            
            // Migrar streak e conquistas
            if (rotina.streak !== undefined) {
                result.streak = rotina.streak;
            }
            if (rotina.conquistas) {
                result.conquistas = rotina.conquistas;
            }
            if (rotina.ultimoReset) {
                result.diaAtual = rotina.ultimoReset;
            }
        }
        
        // Migrar histórico
        if (historicoStr) {
            try {
                result.historico = JSON.parse(historicoStr);
                log.add('INFO', `Migrando ${result.historico.length} registros de histórico`);
            } catch (error) {
                log.add('WARN', 'Erro ao migrar histórico', error.message);
            }
        }
        
        // Migrar categorias
        if (categoriasStr) {
            try {
                result.categorias = JSON.parse(categoriasStr);
                log.add('INFO', `Migrando ${result.categorias.length} categorias`);
            } catch (error) {
                log.add('WARN', 'Erro ao migrar categorias', error.message);
            }
        }
        
        return result;
    } catch (error) {
        log.add('ERROR', 'Erro ao migrar rotina', error.message);
        throw error;
    }
}

/**
 * Migra dados de estudos
 */
function migrateEstudos(log) {
    log.add('INFO', 'Migrando estudos...');
    
    try {
        const estudosStr = localStorage.getItem(V2_KEYS.ESTUDOS);
        if (!estudosStr) {
            log.add('INFO', 'Nenhum dado de estudos encontrado');
            return {
                areasEstudo: [],
                topicosEstudo: [],
                sessoesEstudo: [],
                tagsEstudo: [],
                contadorEstudos: 0,
                configEstudos: {
                    revisaoEspacada: { ativo: true, intervalos: [7, 15, 30] },
                    notificacoes: true,
                    viewPadrao: 'kanban'
                }
            };
        }
        
        const estudos = JSON.parse(estudosStr);
        
        const result = {
            areasEstudo: estudos.areas || estudos.areasEstudo || [],
            topicosEstudo: estudos.topicos || estudos.topicosEstudo || [],
            sessoesEstudo: estudos.sessoes || estudos.sessoesEstudo || [],
            tagsEstudo: estudos.tags || estudos.tagsEstudo || [],
            contadorEstudos: estudos.contador || estudos.contadorEstudos || 0,
            configEstudos: estudos.config || estudos.configEstudos || {
                revisaoEspacada: { ativo: true, intervalos: [7, 15, 30] },
                notificacoes: true,
                viewPadrao: 'kanban'
            }
        };
        
        log.add('INFO', `Migrando ${result.areasEstudo.length} áreas, ${result.topicosEstudo.length} tópicos`);
        
        return result;
    } catch (error) {
        log.add('ERROR', 'Erro ao migrar estudos', error.message);
        throw error;
    }
}

/**
 * Migra avaliações diárias
 */
function migrateAvaliacoes(log) {
    log.add('INFO', 'Migrando avaliações...');
    
    try {
        const avaliacoesStr = localStorage.getItem(V2_KEYS.AVALIACOES);
        if (!avaliacoesStr) {
            return [];
        }
        
        const avaliacoes = JSON.parse(avaliacoesStr);
        log.add('INFO', `Migrando ${avaliacoes.length} avaliações`);
        return Array.isArray(avaliacoes) ? avaliacoes : [];
    } catch (error) {
        log.add('WARN', 'Erro ao migrar avaliações', error.message);
        return [];
    }
}

/**
 * Normaliza estrutura de tarefa
 */
function migrateTask(task) {
    // Se já está no formato correto, retornar
    if (task.id && task.titulo) {
        return task;
    }
    
    // Normalizar campos comuns
    const migrated = {
        ...task,
        id: task.id || `task-${Date.now()}-${Math.random()}`,
        titulo: task.titulo || task.nome || 'Sem título',
        status: normalizeStatus(task.status || task.estado),
        createdAt: task.createdAt || task.dataCriacao || new Date().toISOString(),
        updatedAt: task.updatedAt || task.dataAtualizacao || new Date().toISOString()
    };
    
    return migrated;
}

/**
 * Normaliza estrutura de tarefa de rotina
 */
function migrateRotinaTask(task) {
    return {
        ...task,
        id: task.id || `rotina-${Date.now()}-${Math.random()}`,
        nome: task.nome || task.titulo || 'Sem nome',
        categoria: task.categoria || 'Geral',
        horarios: Array.isArray(task.horarios) ? task.horarios : [],
        prioridade: task.prioridade || 'Média',
        concluida: task.concluida || false,
        pausada: task.pausada || false
    };
}

/**
 * Normaliza status para formato v3
 */
function normalizeStatus(status) {
    const statusMap = {
        'A Fazer': 'todo',
        'Fazendo': 'doing',
        'Em Andamento': 'doing',
        'Revisão': 'doing',
        'Bloqueado': 'todo',
        'Feito': 'done',
        'Concluído': 'done',
        'Concluida': 'done'
    };
    
    return statusMap[status] || status || 'todo';
}

/**
 * Valida estrutura final dos dados migrados
 */
function validateMigratedData(state, log) {
    log.add('INFO', 'Validando dados migrados...');
    
    const errors = [];
    
    // Validar estrutura básica
    if (!state || typeof state !== 'object') {
        errors.push('Estado não é um objeto válido');
    }
    
    // Validar arrays
    const arrays = ['tarefas', 'tarefasRotina', 'topicosEstudo', 'areasEstudo'];
    arrays.forEach(key => {
        if (state[key] && !Array.isArray(state[key])) {
            errors.push(`${key} não é um array`);
        }
    });
    
    if (errors.length > 0) {
        log.add('ERROR', 'Erros de validação encontrados', errors);
        return false;
    }
    
    log.add('SUCCESS', 'Validação concluída sem erros');
    return true;
}

/**
 * Executa migração completa
 */
export async function migrateV2ToV3(options = {}) {
    const {
        skipBackup = false,
        skipValidation = false,
        onProgress = null
    } = options;
    
    const log = new MigrationLog();
    log.start();
    
    try {
        // Verificar se já migrou
        if (localStorage.getItem(V3_KEYS.MIGRATED) && !options.force) {
            log.add('WARN', 'Migração já foi executada anteriormente');
            return { success: false, message: 'Migração já executada', log };
        }
        
        // 1. Criar backup
        if (!skipBackup) {
            log.add('INFO', 'Criando backup dos dados v2...');
            if (onProgress) onProgress('Criando backup...');
            const backup = createBackup();
            log.add('SUCCESS', `Backup criado: ${backup.timestamp}`);
        }
        
        // 2. Validar dados v2
        if (!skipValidation) {
            if (onProgress) onProgress('Validando dados v2...');
            const isValid = validateV2Data(log);
            if (!isValid) {
                log.add('WARN', 'Dados v2 podem estar corrompidos, mas continuando...');
            }
        }
        
        // 3. Migrar cada módulo
        if (onProgress) onProgress('Migrando projetos...');
        const projetos = migrateProjetos(log);
        
        if (onProgress) onProgress('Migrando rotina...');
        const rotina = migrateRotina(log);
        
        if (onProgress) onProgress('Migrando estudos...');
        const estudos = migrateEstudos(log);
        
        if (onProgress) onProgress('Migrando avaliações...');
        const avaliacoes = migrateAvaliacoes(log);
        
        // 4. Montar estado v3
        const v3State = {
            // Projetos
            tarefas: projetos.tarefas,
            contador: projetos.contador,
            
            // Rotina
            tarefasRotina: rotina.tarefasRotina,
            contadorRotina: rotina.contadorRotina,
            historico: rotina.historico,
            categorias: rotina.categorias,
            streak: rotina.streak || 0,
            conquistas: rotina.conquistas || {},
            diaAtual: rotina.diaAtual || new Date().toISOString().split('T')[0],
            
            // Estudos
            ...estudos,
            
            // Avaliações
            avaliacoesDiarias: avaliacoes,
            
            // UI
            darkMode: false,
            filtroStatus: null,
            
            // Meta
            ultimaAtualizacao: new Date().toISOString(),
        };
        
        // 5. Validar dados migrados
        if (!skipValidation) {
            if (onProgress) onProgress('Validando dados migrados...');
            const isValid = validateMigratedData(v3State, log);
            if (!isValid) {
                throw new Error('Dados migrados não passaram na validação');
            }
        }
        
        // 6. Salvar estado v3
        if (onProgress) onProgress('Salvando dados migrados...');
        localStorage.setItem(V3_KEYS.STATE, JSON.stringify(v3State));
        localStorage.setItem(V3_KEYS.MIGRATED, 'true');
        
        // 7. Salvar log
        log.finish(true);
        log.save();
        
        if (onProgress) onProgress('Migração concluída!');
        
        return {
            success: true,
            message: 'Migração concluída com sucesso',
            log,
            data: v3State
        };
        
    } catch (error) {
        log.add('ERROR', 'Erro durante migração', error.message);
        log.finish(false);
        log.save();
        
        // Tentar rollback
        try {
            log.add('INFO', 'Tentando rollback...');
            if (restoreBackup()) {
                log.add('SUCCESS', 'Rollback realizado com sucesso');
            } else {
                log.add('ERROR', 'Falha ao realizar rollback');
            }
        } catch (rollbackError) {
            log.add('ERROR', 'Erro ao fazer rollback', rollbackError.message);
        }
        
        return {
            success: false,
            message: error.message,
            log,
            error
        };
    }
}

/**
 * Função de rollback manual
 */
export function rollbackMigration() {
    const log = new MigrationLog();
    log.start();
    log.add('INFO', 'Iniciando rollback manual...');
    
    try {
        if (restoreBackup()) {
            localStorage.removeItem(V3_KEYS.STATE);
            localStorage.removeItem(V3_KEYS.MIGRATED);
            log.add('SUCCESS', 'Rollback concluído');
            log.finish(true);
            log.save();
            return { success: true, message: 'Rollback concluído' };
        } else {
            throw new Error('Backup não encontrado');
        }
    } catch (error) {
        log.add('ERROR', 'Erro no rollback', error.message);
        log.finish(false);
        log.save();
        return { success: false, message: error.message };
    }
}

/**
 * Obtém log de migração anterior
 */
export function getMigrationLog() {
    return MigrationLog.load();
}

/**
 * Interface para executar migração manualmente (UI)
 */
export function createMigrationUI(container) {
    const ui = document.createElement('div');
    ui.className = 'migration-ui';
    ui.innerHTML = `
        <div class="migration-header">
            <h2>Migração v2 → v3</h2>
            <button class="btn-close" onclick="this.closest('.migration-ui').remove()">×</button>
        </div>
        <div class="migration-content">
            <p>Migrar dados do formato antigo (v2) para o novo formato (v3)</p>
            <div id="migration-progress" class="migration-progress hidden"></div>
            <div id="migration-log" class="migration-log"></div>
            <div class="migration-actions">
                <button class="btn btn-primary" id="btn-migrate">Iniciar Migração</button>
                <button class="btn btn-secondary" id="btn-rollback">Rollback</button>
                <button class="btn btn-secondary" id="btn-view-log">Ver Log Anterior</button>
            </div>
        </div>
    `;
    
    container.appendChild(ui);
    applyMigrationUIStyles();
    
    // Event listeners
    document.getElementById('btn-migrate').addEventListener('click', () => {
        executeMigrationWithUI(ui);
    });
    
    document.getElementById('btn-rollback').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja fazer rollback? Isso restaurará os dados v2.')) {
            const result = rollbackMigration();
            showMigrationResult(ui, result);
        }
    });
    
    document.getElementById('btn-view-log').addEventListener('click', () => {
        const log = getMigrationLog();
        if (log) {
            showMigrationLog(ui, log);
        } else {
            alert('Nenhum log de migração encontrado');
        }
    });
}

function executeMigrationWithUI(ui) {
    const progressEl = ui.querySelector('#migration-progress');
    const logEl = ui.querySelector('#migration-log');
    const btnMigrate = ui.querySelector('#btn-migrate');
    
    progressEl.classList.remove('hidden');
    logEl.innerHTML = '';
    btnMigrate.disabled = true;
    
    migrateV2ToV3({
        onProgress: (message) => {
            progressEl.textContent = message;
            logEl.innerHTML += `<div class="log-entry">${message}</div>`;
        }
    }).then(result => {
        btnMigrate.disabled = false;
        progressEl.classList.add('hidden');
        showMigrationResult(ui, result);
    });
}

function showMigrationResult(ui, result) {
    const logEl = ui.querySelector('#migration-log');
    const statusClass = result.success ? 'success' : 'error';
    logEl.innerHTML = `
        <div class="migration-result ${statusClass}">
            <strong>${result.success ? '✅ Sucesso!' : '❌ Erro'}</strong>
            <p>${result.message}</p>
        </div>
    `;
}

function showMigrationLog(ui, log) {
    const logEl = ui.querySelector('#migration-log');
    logEl.innerHTML = `
        <div class="migration-log-view">
            <h3>Log de Migração</h3>
            <div class="log-entries">
                ${log.entries.map(entry => `
                    <div class="log-entry log-${entry.type.toLowerCase()}">
                        <span class="log-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
                        <span class="log-message">${entry.message}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function applyMigrationUIStyles() {
    const styleId = 'migration-ui-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .migration-ui {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 20px auto;
        }
        .migration-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .migration-progress {
            background: #f0f0f0;
            padding: 12px;
            border-radius: 8px;
            margin: 16px 0;
        }
        .migration-log {
            max-height: 300px;
            overflow-y: auto;
            background: #f8f8f8;
            padding: 12px;
            border-radius: 8px;
            margin: 16px 0;
            font-family: monospace;
            font-size: 12px;
        }
        .log-entry {
            padding: 4px 0;
        }
        .migration-result.success {
            background: #d1fae5;
            color: #065f46;
            padding: 12px;
            border-radius: 8px;
        }
        .migration-result.error {
            background: #fee2e2;
            color: #991b1b;
            padding: 12px;
            border-radius: 8px;
        }
        .migration-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }
    `;
    document.head.appendChild(style);
}



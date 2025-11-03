const fs = require('fs');
const path = require('path');

// Ler dados do arquivo
const dadosPath = path.join(__dirname, '../../dados.json');
const dados = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));

const PUSHCUT_API_KEY = process.env.PUSHCUT_API_KEY || dados.apiKey;

// Função para calcular horário 5 minutos antes
function calcularHorarioAntes(horario, minutos) {
    const [horas, mins] = horario.split(':').map(Number);
    let totalMinutos = horas * 60 + mins - minutos;
    
    if (totalMinutos < 0) {
        totalMinutos += 24 * 60;
    }
    
    const novasHoras = Math.floor(totalMinutos / 60);
    const novosMinutos = totalMinutos % 60;
    
    return `${String(novasHoras).padStart(2, '0')}:${String(novosMinutos).padStart(2, '0')}`;
}

// Obter horário atual (HH:MM)
function getHorarioAtual() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

// Enviar notificação via Pushcut
async function enviarNotificacao(tarefa, horario) {
    const url = 'https://api.pushcut.io/v1/notifications/Tarefa';
    
    const payload = {
        title: `⏰ ${tarefa.categoria || 'Tarefa'}`,
        text: `${tarefa.nome}\n🕐 Horário: ${horario}`,
        isTimeSensitive: tarefa.prioridade === 'Alta' || tarefa.prioridade === 'Urgente',
        input: {
            horario: horario,
            tarefa: tarefa.nome,
            categoria: tarefa.categoria || 'Sem categoria',
            prioridade: tarefa.prioridade || 'Média',
            id: tarefa.id
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'API-Key': PUSHCUT_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`✅ Notificação enviada: ${tarefa.nome} (${horario})`);
            return true;
        } else {
            const erro = await response.text();
            console.error(`❌ Erro ao enviar notificação: ${erro}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Erro de conexão: ${error.message}`);
        return false;
    }
}

// Função principal
async function verificarEEnviar() {
    console.log('🔍 Verificando notificações...');
    console.log(`⏰ Horário atual: ${getHorarioAtual()}`);
    
    if (!dados.tarefasRotina || dados.tarefasRotina.length === 0) {
        console.log('📭 Nenhuma tarefa cadastrada.');
        return;
    }

    const horarioAtual = getHorarioAtual();
    let notificacoesEnviadas = 0;

    // Filtrar tarefas com horários
    const tarefasComHorarios = dados.tarefasRotina.filter(t => 
        t.horarios && 
        t.horarios.length > 0 && 
        !t.concluida && 
        !t.pausada
    );

    console.log(`📋 ${tarefasComHorarios.length} tarefa(s) ativa(s) com horário(s)`);

    // Verificar cada tarefa e horário
    for (const tarefa of tarefasComHorarios) {
        for (const horario of tarefa.horarios) {
            const horarioNotificacao = calcularHorarioAntes(horario, 5);
            
            // Se o horário de notificação é AGORA
            if (horarioNotificacao === horarioAtual) {
                console.log(`⏰ Hora de notificar: ${tarefa.nome} (${horario})`);
                const sucesso = await enviarNotificacao(tarefa, horario);
                
                if (sucesso) {
                    notificacoesEnviadas++;
                }
            }
        }
    }

    if (notificacoesEnviadas > 0) {
        console.log(`\n🎉 Total: ${notificacoesEnviadas} notificação(ões) enviada(s)!`);
    } else {
        console.log('✅ Nenhuma notificação programada para este horário.');
    }
}

// Executar
verificarEEnviar().catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
});


/**
 * Filtros e utilitários para tarefas
 */

import { addHoursToDate, isFuture, isPast, getDaysOverdue, toDate } from './dateUtils.js';

/**
 * Filtra tarefas das próximas N horas
 */
export function getUpcomingTasks(tasks, hoursAhead = 2) {
  if (!tasks || !Array.isArray(tasks)) return [];

  const now = new Date();
  const limit = addHoursToDate(now, hoursAhead);

  return tasks
    .filter((task) => {
      if (task.completed) return false;
      if (!task.time) return false;

      const taskTime = toDate(task.time);
      if (!taskTime) return false;

      return taskTime >= now && taskTime <= limit;
    })
    .sort((a, b) => {
      const timeA = toDate(a.time);
      const timeB = toDate(b.time);
      if (!timeA || !timeB) return 0;
      return timeA - timeB;
    });
}

/**
 * Filtra tarefas atrasadas
 */
export function getOverdueTasks(tasks) {
  if (!tasks || !Array.isArray(tasks)) return [];

  const now = new Date();

  return tasks
    .filter((task) => {
      if (task.completed) return false;
      if (!task.time && !task.deadline) return false;

      const taskDate = toDate(task.time || task.deadline);
      if (!taskDate) return false;

      return taskDate < now;
    })
    .map((task) => {
      const taskDate = toDate(task.time || task.deadline);
      return {
        ...task,
        daysOverdue: getDaysOverdue(taskDate),
      };
    })
    .sort((a, b) => {
      // Ordenar por prioridade primeiro, depois por dias de atraso
      const priorityOrder = { urgente: 4, alta: 3, media: 2, baixa: 1 };
      const priorityA = priorityOrder[a.prioridade?.toLowerCase()] || 0;
      const priorityB = priorityOrder[b.prioridade?.toLowerCase()] || 0;

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      return b.daysOverdue - a.daysOverdue;
    });
}

/**
 * Filtra tarefas concluídas hoje
 */
export function getTasksCompletedToday(tasks) {
  if (!tasks || !Array.isArray(tasks)) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    if (!task.completed || !task.completedAt) return false;

    const completedDate = toDate(task.completedAt);
    if (!completedDate) return false;

    completedDate.setHours(0, 0, 0, 0);
    return completedDate.getTime() === today.getTime();
  });
}

/**
 * Calcula total de tarefas do dia
 */
export function getTotalTasksToday(tasks) {
  if (!tasks || !Array.isArray(tasks)) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    if (task.completed) return false;
    if (!task.time) return false;

    const taskDate = toDate(task.time);
    if (!taskDate) return false;

    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).length;
}

/**
 * Filtra todas as tarefas concluídas
 * Retorna tarefas com completed: true, ordenadas por data de conclusão (mais recentes primeiro)
 */
export function getCompletedTasks(tasks) {
  if (!tasks || !Array.isArray(tasks)) return [];

  return tasks
    .filter((task) => task.completed === true)
    .map((task) => {
      const completedDate = toDate(task.completedAt);
      return {
        ...task,
        completedDate: completedDate || new Date(0),
      };
    })
    .sort((a, b) => {
      // Ordenar por data de conclusão (mais recentes primeiro)
      return b.completedDate - a.completedDate;
    });
}

/**
 * Filtra tarefas adiadas (com horário futuro além das próximas 2 horas)
 * Retorna tarefas não completas com time no futuro além das próximas 2 horas, ordenadas por data/hora
 */
export function getPostponedTasks(tasks) {
  if (!tasks || !Array.isArray(tasks)) return [];

  const now = new Date();
  const twoHoursFromNow = addHoursToDate(now, 2);

  return tasks
    .filter((task) => {
      if (task.completed) return false;
      if (!task.time) return false;

      const taskTime = toDate(task.time);
      if (!taskTime) return false;

      // Tarefas com horário no futuro além das próximas 2 horas
      return taskTime > twoHoursFromNow;
    })
    .sort((a, b) => {
      const timeA = toDate(a.time);
      const timeB = toDate(b.time);
      if (!timeA || !timeB) return 0;
      return timeA - timeB; // Ordenar por data/hora (ascendente)
    });
}

/**
 * Combina tarefas de rotina e projetos
 */
export function combineTasks(rotinaTasks = [], projetoTasks = []) {
  return [...rotinaTasks, ...projetoTasks];
}


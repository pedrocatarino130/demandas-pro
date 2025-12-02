import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { Task, Priority, Status } from '../types';
import { NeonButton } from './NeonButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    status: Status.TODO,
    tags: [],
    dueDate: new Date().toISOString().split('T')[0],
    assignee: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setTagInput(initialData.tags.join(', '));
      } else {
        setFormData({
          title: '',
          description: '',
          priority: Priority.MEDIUM,
          status: Status.TODO,
          tags: [],
          dueDate: new Date().toISOString().split('T')[0],
          assignee: ''
        });
        setTagInput('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({ ...formData, tags });
    onClose();
  };

  const inputClass = "w-full p-3 bg-[#3a3a3a] text-white rounded-xl border border-transparent focus:border-white outline-none transition-all placeholder-gray-500 text-sm";
  const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Container from Uiverse - Adapted to be responsive */}
      <div className="relative w-full max-w-md bg-[#272727] rounded-[24px] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 animate-in fade-in zoom-in duration-200">
        
        {/* Spinning Border Effect */}
        <div className="absolute inset-[-50px] z-[-2] bg-[conic-gradient(from_45deg,transparent_75%,#fff,transparent_100%)] animate-[spin_4s_linear_infinite] opacity-20"></div>
        
        {/* Inner Content Box */}
        <div className="absolute inset-[1px] bg-[#272727] rounded-[24px] z-[-1]"></div>

        <div className="p-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {initialData ? 'Editar Tarefa' : 'Criar Tarefa'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Título *</label>
              <input 
                type="text" 
                required
                className={`${inputClass} ring-1 ring-[#03a9f4]/50 focus:ring-[#03a9f4] bg-[#03a9f4]/5`}
                placeholder="Ex: Refatorar Homepage"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className={labelClass}>Descrição</label>
              <textarea 
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Detalhes da tarefa..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prioridade</label>
                <select 
                  className={inputClass}
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                >
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                 <label className={labelClass}>Responsável</label>
                 <input 
                  type="text"
                  className={inputClass}
                  placeholder="Nome"
                  value={formData.assignee}
                  onChange={e => setFormData({...formData, assignee: e.target.value})}
                 />
              </div>
            </div>

            <div>
              <label className={labelClass}>Tags (separadas por vírgula)</label>
              <input 
                type="text"
                className={inputClass}
                placeholder="frontend, urgente, bug"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className={labelClass}>Data</label>
                  <input 
                    type="date"
                    className={inputClass}
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
               </div>
               <div>
                  <label className={labelClass}>Status</label>
                  <select 
                    className={inputClass}
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as Status})}
                  >
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 font-medium hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <div className="flex-1">
                 <NeonButton type="submit" className="w-full">
                    <Save size={18} />
                    <span>Salvar</span>
                 </NeonButton>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
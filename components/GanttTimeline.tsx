
import React, { useState, useMemo, useRef } from 'react';
import { Client, Task } from '../types';
import { 
  format, 
  differenceInDays, 
  addMonths, 
  addDays,
  addWeeks,
  addQuarters,
  isToday
} from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronsLeft, 
  ChevronsRight, 
  X, 
  Clock, 
  Calendar as CalendarIcon, 
  FileText,
  Activity
} from 'lucide-react';

const parseISO = (s: string) => {
  if (!s) return new Date();
  const parts = s.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parts[2] ? parseInt(parts[2], 10) : 1;
  return new Date(y, m - 1, d);
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

interface GanttTimelineProps {
  client: Client;
}

type ViewMode = 'days' | 'weeks' | 'months' | 'quarters' | 'semesters';

const GanttTimeline: React.FC<GanttTimelineProps> = ({ client }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [pivotDate, setPivotDate] = useState<Date>(() => startOfMonth(new Date()));
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scaleConfig = useMemo(() => {
    switch (viewMode) {
      case 'days': return { unitWidth: 45, units: 60 };
      case 'weeks': return { unitWidth: 100, units: 24 };
      case 'months': return { unitWidth: 180, units: 12 };
      case 'quarters': return { unitWidth: 250, units: 8 };
      case 'semesters': return { unitWidth: 350, units: 4 };
      default: return { unitWidth: 45, units: 60 };
    }
  }, [viewMode]);

  const timelineStart = pivotDate;
  const timelineEnd = useMemo(() => {
    if (viewMode === 'days') return addDays(timelineStart, scaleConfig.units);
    if (viewMode === 'weeks') return addWeeks(timelineStart, scaleConfig.units);
    if (viewMode === 'months') return addMonths(timelineStart, scaleConfig.units);
    if (viewMode === 'quarters') return addQuarters(timelineStart, scaleConfig.units);
    if (viewMode === 'semesters') return addMonths(timelineStart, scaleConfig.units * 6);
    return addDays(timelineStart, 60);
  }, [timelineStart, viewMode, scaleConfig.units]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setPivotDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  const getTaskStyle = (task: Task, index: number) => {
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    const diffStart = differenceInDays(start, timelineStart);
    const duration = differenceInDays(end, start) + 1;
    
    let pixelsPerDay = 0;
    if (viewMode === 'days') pixelsPerDay = scaleConfig.unitWidth;
    else if (viewMode === 'weeks') pixelsPerDay = scaleConfig.unitWidth / 7;
    else if (viewMode === 'months') pixelsPerDay = scaleConfig.unitWidth / 30;
    else if (viewMode === 'quarters') pixelsPerDay = scaleConfig.unitWidth / 90;
    else if (viewMode === 'semesters') pixelsPerDay = scaleConfig.unitWidth / 180;

    const left = diffStart * pixelsPerDay;
    const width = duration * pixelsPerDay;
    
    return {
      left: `${left}px`,
      width: `${Math.max(width, 35)}px`,
      top: `${index * 55 + 20}px`
    };
  };

  const renderHeader = () => {
    const units = [];
    let current = new Date(timelineStart);

    for (let i = 0; i < scaleConfig.units; i++) {
      let label = "";
      let subLabel = "";
      let isTodayUnit = false;

      if (viewMode === 'days') {
        label = format(current, 'MMM', { locale: pt });
        subLabel = format(current, 'd');
        isTodayUnit = isToday(current);
        current = addDays(current, 1);
      } else if (viewMode === 'weeks') {
        label = format(current, 'MMM yy', { locale: pt });
        subLabel = `S${format(current, 'w')}`;
        current = addWeeks(current, 1);
      } else if (viewMode === 'months') {
        label = format(current, 'yyyy');
        subLabel = format(current, 'MMMM', { locale: pt });
        current = addMonths(current, 1);
      } else if (viewMode === 'quarters') {
        label = format(current, 'yyyy');
        subLabel = `${Math.floor(current.getMonth() / 3) + 1}º Trim`;
        current = addQuarters(current, 1);
      } else if (viewMode === 'semesters') {
        label = format(current, 'yyyy');
        subLabel = current.getMonth() < 6 ? '1º Sem' : '2º Sem';
        current = addMonths(current, 6);
      }

      units.push(
        <div 
          key={i} 
          style={{ width: `${scaleConfig.unitWidth}px` }}
          className={`flex-shrink-0 border-r border-slate-100 flex flex-col items-center justify-center text-center ${isTodayUnit ? 'bg-blue-50/50' : ''}`}
        >
          <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400">{label}</span>
          <span className={`text-[11px] md:text-xs font-bold ${isTodayUnit ? 'text-blue-600' : 'text-slate-700'} capitalize`}>{subLabel}</span>
        </div>
      );
    }
    return units;
  };

  const totalWidth = scaleConfig.units * scaleConfig.unitWidth;

  return (
    <div className="flex flex-col h-full select-none bg-white relative">
      <div className="bg-slate-50 p-2 md:p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky left-0 z-40">
        <div className="flex items-center gap-1 md:gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
          {(['days', 'weeks', 'months', 'quarters', 'semesters'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${viewMode === mode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {mode === 'days' ? 'Dias' : mode === 'weeks' ? 'Semanas' : mode === 'months' ? 'Meses' : mode === 'quarters' ? 'Trimestres' : 'Semestres'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-slate-50 text-slate-400 border-r" title="Mês Anterior">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-2 text-[10px] md:text-xs font-bold text-slate-600 min-w-[100px] md:min-w-[140px] text-center capitalize">
              {format(pivotDate, 'MMMM yyyy', { locale: pt })}
            </div>
            <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-slate-50 text-slate-400 border-l" title="Próximo Mês">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={stopDragging}
        onTouchMove={handleTouchMove}
        className={`flex-1 overflow-auto custom-scrollbar transition-all ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="relative" style={{ width: `${totalWidth}px`, minHeight: '400px' }}>
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 flex h-12 md:h-14">
            {renderHeader()}
          </div>

          <div className="absolute inset-0 flex pointer-events-none pt-12 md:pt-14">
            {Array.from({ length: scaleConfig.units }).map((_, i) => (
              <div key={i} style={{ width: `${scaleConfig.unitWidth}px` }} className="flex-shrink-0 border-r border-slate-50 h-full" />
            ))}
          </div>

          <div className="relative pt-4 px-2" style={{ height: `${client.tasks.length * 55 + 80}px` }}>
            {client.tasks.map((task, idx) => {
              const style = getTaskStyle(task, idx);
              const taskStart = parseISO(task.startDate);
              const taskEnd = parseISO(task.endDate);
              if (taskEnd < timelineStart || taskStart > timelineEnd) return null;

              let colorClass = 'bg-slate-100 border-slate-200 text-slate-700';
              if (task.checked) colorClass = 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm';
              else if (task.missed) colorClass = 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm';
              else if (task.status === 'em curso') colorClass = 'bg-blue-50 border-blue-200 text-blue-800';
              
              return (
                <div 
                  key={task.id}
                  onClick={(e) => { e.stopPropagation(); setPreviewTask(task); }}
                  className={`absolute h-8 md:h-9 rounded-lg border flex items-center justify-between px-2 md:px-3 text-[9px] md:text-[10px] font-bold truncate transition-all hover:z-20 hover:scale-[1.02] hover:shadow-lg cursor-pointer group ${colorClass}`}
                  style={style}
                >
                  <span className="truncate pr-1">{task.name}</span>
                  <div className="flex-shrink-0">
                    {task.checked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {task.missed && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                  </div>

                  <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 z-50 bg-slate-900 text-white p-3 rounded-xl w-48 md:w-56 shadow-2xl pointer-events-none border border-slate-700">
                    <p className="font-bold text-xs md:text-sm mb-1">{task.name}</p>
                    <div className="grid grid-cols-2 gap-1 text-[9px] md:text-[10px] opacity-80">
                      <span>Início: {format(taskStart, 'dd/MM/yy')}</span>
                      <span>Fim: {format(taskEnd, 'dd/MM/yy')}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500/40 z-10 pointer-events-none"
              style={{ 
                left: `${differenceInDays(new Date(), timelineStart) * (viewMode === 'days' ? scaleConfig.unitWidth : (viewMode === 'weeks' ? scaleConfig.unitWidth/7 : scaleConfig.unitWidth/30))}px`,
                display: (new Date() >= timelineStart && new Date() <= timelineEnd) ? 'block' : 'none'
              }}
            >
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full -ml-1 shadow-md border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-2 md:p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span>Concluído</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span>Em Curso</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><span>Faltou</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div><span>Pendente</span></div>
      </div>

      {/* Modal de Preview Detalhado */}
      {previewTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setPreviewTask(null)}>
          <div 
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      previewTask.checked ? 'bg-emerald-100 text-emerald-700' : 
                      previewTask.missed ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {previewTask.checked ? 'Concluída' : previewTask.missed ? 'Faltou' : 'Agendada'}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                    {previewTask.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setPreviewTask(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Período</p>
                    <p className="text-xs font-bold text-slate-700">
                      {format(parseISO(previewTask.startDate), 'dd/MM')} - {format(parseISO(previewTask.endDate), 'dd/MM')}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Horário</p>
                    <p className="text-xs font-bold text-slate-700">
                      {previewTask.startTime} às {previewTask.endTime}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 col-span-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Estado do Processo</p>
                    <p className="text-xs font-bold text-slate-700 capitalize">
                      {previewTask.status}
                    </p>
                  </div>
                </div>
              </div>

              {previewTask.observations && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase px-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Notas e Observações</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{previewTask.observations}"
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setPreviewTask(null)}
                  className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttTimeline;

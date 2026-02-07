
import React, { useMemo } from 'react';
import { Client, Task } from '../types';
import { format, parseISO, differenceInDays, startOfMonth, endOfMonth, addMonths, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, XCircle } from 'lucide-react';

interface GanttTimelineProps {
  client: Client;
}

const GanttTimeline: React.FC<GanttTimelineProps> = ({ client }) => {
  // Determine date range for the timeline
  const { timelineStart, timelineEnd, months } = useMemo(() => {
    if (client.tasks.length === 0) {
      const today = new Date();
      return { 
        timelineStart: startOfMonth(today), 
        timelineEnd: endOfMonth(addMonths(today, 1)),
        months: [today, addMonths(today, 1)]
      };
    }

    const startDates = client.tasks.map(t => parseISO(t.startDate).getTime());
    const endDates = client.tasks.map(t => parseISO(t.endDate).getTime());
    
    const minDate = new Date(Math.min(...startDates));
    const maxDate = new Date(Math.max(...endDates));

    // Pad by one month on each side for better visibility
    const timelineStart = startOfMonth(minDate);
    const timelineEnd = endOfMonth(addMonths(maxDate, 1));

    const months: Date[] = [];
    let current = timelineStart;
    while (current <= timelineEnd) {
      months.push(current);
      current = addMonths(current, 1);
    }

    return { timelineStart, timelineEnd, months };
  }, [client]);

  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1;
  const DAY_WIDTH = 40; // Pixels per day
  const timelineWidth = totalDays * DAY_WIDTH;

  const getTaskStyle = (task: Task, index: number) => {
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    const leftOffset = differenceInDays(start, timelineStart) * DAY_WIDTH;
    const width = (differenceInDays(end, start) + 1) * DAY_WIDTH;
    
    return {
      left: `${leftOffset}px`,
      width: `${Math.max(width, 40)}px`, // Garantir largura mínima para exibir ícone
      top: `${index * 60 + 20}px`
    };
  };

  return (
    <div className="relative min-w-full bg-white rounded-lg select-none">
      {/* Timeline Header - Months and Days */}
      <div 
        className="sticky top-0 z-10 border-b border-slate-100 bg-white"
        style={{ width: `${timelineWidth}px` }}
      >
        {/* Months Bar */}
        <div className="flex h-12">
          {months.map(month => {
            const daysInMonth = differenceInDays(endOfMonth(month), startOfMonth(month)) + 1;
            return (
              <div 
                key={month.toISOString()}
                style={{ width: `${daysInMonth * DAY_WIDTH}px` }}
                className="border-r border-slate-100 flex items-center px-4 font-semibold text-slate-800"
              >
                {format(month, 'MMMM yyyy', { locale: ptBR })}
              </div>
            );
          })}
        </div>
        
        {/* Days Bar */}
        <div className="flex h-10 border-t border-slate-100">
          {eachDayOfInterval({ start: timelineStart, end: timelineEnd }).map(day => (
            <div 
              key={day.toISOString()}
              style={{ width: `${DAY_WIDTH}px` }}
              className={`flex-shrink-0 border-r border-slate-50 flex flex-col items-center justify-center text-[10px] leading-tight ${isToday(day) ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-400'}`}
            >
              <span>{format(day, 'EEE', { locale: ptBR })}</span>
              <span>{format(day, 'd')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Content - Task Bars */}
      <div 
        className="relative" 
        style={{ width: `${timelineWidth}px`, height: `${client.tasks.length * 60 + 100}px` }}
      >
        {/* Vertical Grid Lines */}
        <div className="absolute inset-0 flex pointer-events-none">
          {eachDayOfInterval({ start: timelineStart, end: timelineEnd }).map(day => (
            <div 
              key={day.toISOString()}
              style={{ width: `${DAY_WIDTH}px` }}
              className={`flex-shrink-0 h-full border-r ${isToday(day) ? 'bg-blue-50/20 border-blue-200' : 'border-slate-50'}`}
            />
          ))}
        </div>

        {/* Task Items (Gantt Blocks) */}
        {client.tasks.map((task, idx) => {
          const style = getTaskStyle(task, idx);
          
          let colorClass = 'bg-slate-100 border-slate-200 text-slate-700';
          if (task.checked) {
             colorClass = 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm shadow-emerald-50';
          } else if (task.missed) {
             colorClass = 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm shadow-rose-50';
          } else if (task.status === 'em curso') {
             colorClass = 'bg-amber-50 border-amber-200 text-amber-800';
          }
          
          return (
            <div 
              key={task.id}
              className={`absolute h-10 rounded-lg border-2 flex items-center justify-between px-3 text-xs overflow-hidden transition-all hover:scale-[1.02] hover:shadow-md cursor-default group ${colorClass}`}
              style={style}
            >
              <div className="flex flex-col truncate pr-2">
                <span className="font-bold truncate">{task.name}</span>
                <span className="text-[9px] opacity-70">
                  {task.startTime} - {task.endTime}
                </span>
              </div>
              
              <div className="flex-shrink-0">
                {task.checked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {task.missed && <XCircle className="w-4 h-4 text-rose-600" />}
              </div>
              
              {/* Tooltip on hover */}
              <div className="invisible group-hover:visible absolute top-full left-0 mt-2 z-30 bg-slate-900 text-white p-3 rounded-lg w-48 shadow-xl pointer-events-none">
                <p className="font-bold mb-1">{task.name}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] opacity-80">
                  <div>Início: {task.startTime}</div>
                  <div>Fim: {task.endTime}</div>
                  <div className="col-span-2 capitalize">Status: {task.status}</div>
                  <div className="col-span-2">
                    Resultado: {task.checked ? '✓ Cumpriu' : task.missed ? '✗ Faltou' : 'Pendente'}
                  </div>
                </div>
                {task.observations && (
                   <p className="mt-2 text-[10px] border-t border-slate-700 pt-2 line-clamp-3 italic">
                     "{task.observations}"
                   </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Today Indicator Line */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-blue-500 z-10 pointer-events-none"
          style={{ 
            left: `${differenceInDays(new Date(), timelineStart) * DAY_WIDTH + (DAY_WIDTH / 2)}px`,
            display: (new Date() >= timelineStart && new Date() <= timelineEnd) ? 'block' : 'none'
          }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full -ml-1.5 -mt-1 shadow-md shadow-blue-200"></div>
        </div>
      </div>
    </div>
  );
};

export default GanttTimeline;


import React, { useState, useMemo } from 'react';
import { CalendarEvent, AcademicArea } from '../types';
import { AREAS } from '../constants';
import { dateToAngle, describeDonutSector, parseDate, polarToCartesian } from '../utils';
import { format } from 'date-fns';
import { nb } from '../utils';
import { AlertCircle } from 'lucide-react';

interface YearWheelViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const YearWheelView: React.FC<YearWheelViewProps> = ({ events, onSelectEvent }) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  
  const currentYear = 2025; // In a real app, this could be dynamic
  const size = 800;
  const cx = size / 2;
  const cy = size / 2;
  
  // Configuration
  const outerRadius = 380;
  const innerRadiusBase = 120;
  const ringGap = 5;
  
  // Color mapping (matching CalendarView)
  const colors: Record<AcademicArea, string> = {
    'Opptak': '#3b82f6', // blue-500
    'Semesterstart': '#22c55e', // green-500
    'Eksamen': '#ef4444', // red-500
    'Emne- og porteføljearbeid': '#a855f7', // purple-500
    'Internasjonalisering': '#f97316', // orange-500
    'Studieplanprosessen': '#0891b2', // cyan-600
    'Annet': '#6b7280' // gray-500
  };

  const darkColors: Record<AcademicArea, string> = {
    'Opptak': '#2563eb', // blue-600
    'Semesterstart': '#16a34a', // green-600
    'Eksamen': '#dc2626', // red-600
    'Emne- og porteføljearbeid': '#9333ea', // purple-600
    'Internasjonalisering': '#ea580c', // orange-600
    'Studieplanprosessen': '#0e7490', // cyan-700
    'Annet': '#4b5563' // gray-600
  };

  // Determine which areas have events to filter out empty rings
  const activeAreas = useMemo(() => {
    return AREAS.filter(area => events.some(e => e.area === area));
  }, [events]);

  const ringThickness = (outerRadius - innerRadiusBase) / (activeAreas.length || 1) - ringGap;

  // Month markers (Outer Ring)
  const monthMarkers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1);
      const angle = dateToAngle(date, currentYear);
      // Place label in the middle of the month sector
      const nextDate = new Date(currentYear, i + 1, 1);
      const nextAngle = dateToAngle(nextDate, currentYear);
      const midAngle = (angle + (nextAngle > angle ? nextAngle : 360 + nextAngle)) / 2; // Approximate
      
      const labelPos = polarToCartesian(cx, cy, outerRadius + 20, midAngle);
      
      return {
        label: format(date, 'MMM', { locale: nb }).toUpperCase(),
        angle,
        x: labelPos.x,
        y: labelPos.y
      };
    });
  }, [currentYear, cx, cy, outerRadius]);

  // Today marker
  const todayAngle = dateToAngle(new Date(), currentYear);
  const todayPosStart = polarToCartesian(cx, cy, innerRadiusBase, todayAngle);
  const todayPosEnd = polarToCartesian(cx, cy, outerRadius, todayAngle);

  return (
    <div className="flex flex-col items-center h-[75vh] w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm max-w-xs">
         <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#00509e] dark:text-blue-400" />
            Tegnforklaring
         </h3>
         <div className="space-y-1">
           {activeAreas.map(area => (
             <div key={area} className="flex items-center gap-2 text-xs">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[area] }} />
               <span className="text-gray-600 dark:text-gray-300">{area}</span>
             </div>
           ))}
         </div>
      </div>

      <div className="w-full h-full flex items-center justify-center p-4">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full h-full max-w-[800px] max-h-[800px] animate-in fade-in zoom-in duration-500"
          style={{ overflow: 'visible' }}
        >
          {/* Background Circles */}
          <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="currentColor" className="text-gray-100 dark:text-slate-800" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={innerRadiusBase} fill="none" stroke="currentColor" className="text-gray-100 dark:text-slate-800" strokeWidth="1" />
          
          {/* Month Separators */}
          {monthMarkers.map((m, i) => {
             const startP = polarToCartesian(cx, cy, innerRadiusBase, m.angle);
             const endP = polarToCartesian(cx, cy, outerRadius, m.angle);
             return (
               <line 
                key={i} 
                x1={startP.x} y1={startP.y} 
                x2={endP.x} y2={endP.y} 
                stroke="currentColor" 
                className="text-gray-200 dark:text-slate-700" 
                strokeDasharray="4 4"
               />
             );
          })}

          {/* Month Labels */}
          {monthMarkers.map((m, i) => (
            <text
              key={i}
              x={m.x}
              y={m.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-bold fill-gray-500 dark:fill-gray-400 select-none pointer-events-none"
            >
              {m.label}
            </text>
          ))}

          {/* Data Rings */}
          {activeAreas.map((area, index) => {
            const areaEvents = events.filter(e => e.area === area);
            // From inner to outer
            const rInner = innerRadiusBase + (index * (ringThickness + ringGap));
            const rOuter = rInner + ringThickness;
            
            return (
              <g key={area} className="group">
                {/* Ring Background (faint) */}
                <path 
                  d={describeDonutSector(cx, cy, rInner, rOuter, 0, 359.99)} 
                  fill="transparent"
                  stroke="currentColor"
                  className="text-gray-50 dark:text-slate-800/50"
                  strokeWidth="1"
                />

                {/* Events */}
                {areaEvents.map(event => {
                  const startDate = parseDate(event.startDate);
                  const endDate = parseDate(event.endDate);
                  
                  // Simple clamp to year 2025
                  if (startDate.getFullYear() > currentYear || endDate.getFullYear() < currentYear) return null;
                  
                  let startAngle = dateToAngle(startDate, currentYear);
                  let endAngle = dateToAngle(endDate, currentYear);
                  
                  // Ensure visible width for single-day events/deadlines
                  const isDeadline = event.type === 'Deadline' || startAngle === endAngle;
                  if (isDeadline) {
                    endAngle = startAngle + 1; // 1 degree width
                  } else if (endAngle < startAngle) {
                     // Handle wrap around year (simplified: just cut off at 360 for this view)
                     endAngle = 360; 
                  }
                  
                  // Ensure minimum visibility
                  if (endAngle - startAngle < 0.5) endAngle = startAngle + 0.5;

                  const isHovered = hoveredEventId === event.id;
                  const color = isHovered ? colors[area] : (darkColors[area] || colors[area]);
                  
                  return (
                    <g 
                      key={event.id} 
                      onClick={() => onSelectEvent(event)}
                      onMouseEnter={() => setHoveredEventId(event.id)}
                      onMouseLeave={() => setHoveredEventId(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {isDeadline ? (
                        <circle
                          cx={polarToCartesian(cx, cy, (rInner + rOuter) / 2, startAngle).x}
                          cy={polarToCartesian(cx, cy, (rInner + rOuter) / 2, startAngle).y}
                          r={isHovered ? 6 : 4}
                          fill={color}
                          className="drop-shadow-sm"
                        />
                      ) : (
                        <path
                          d={describeDonutSector(cx, cy, rInner, rOuter, startAngle, endAngle)}
                          fill={color}
                          fillOpacity={isHovered ? 1 : 0.7}
                          className="transition-opacity duration-200"
                        />
                      )}
                      
                      {/* Interaction Hit Area (larger) */}
                       {isDeadline && (
                         <circle
                          cx={polarToCartesian(cx, cy, (rInner + rOuter) / 2, startAngle).x}
                          cy={polarToCartesian(cx, cy, (rInner + rOuter) / 2, startAngle).y}
                          r={10}
                          fill="transparent"
                        />
                       )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Today Marker */}
          <line
            x1={todayPosStart.x} y1={todayPosStart.y}
            x2={todayPosEnd.x} y2={todayPosEnd.y}
            stroke="currentColor"
            className="text-red-500 dark:text-red-400"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <circle 
            cx={todayPosEnd.x} cy={todayPosEnd.y} 
            r={4} 
            className="fill-red-500 dark:fill-red-400" 
          />

          {/* Center Text */}
          <text x={cx} y={cy - 10} textAnchor="middle" className="text-3xl font-black fill-gray-800 dark:fill-white select-none">
            {currentYear}
          </text>
          <text x={cx} y={cy + 15} textAnchor="middle" className="text-xs uppercase font-bold fill-gray-500 dark:fill-gray-400 select-none tracking-widest">
            Oversikt
          </text>
        </svg>

        {/* Hover Tooltip (HTML Overlay) */}
        {hoveredEventId && (() => {
           const event = events.find(e => e.id === hoveredEventId);
           if (!event) return null;
           return (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
               <div className="bg-gray-900/95 dark:bg-black/95 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xs text-center border border-white/10 animate-in zoom-in-95 duration-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">{event.area}</div>
                  <h4 className="font-bold text-lg leading-tight mb-2">{event.title}</h4>
                  <div className="text-xs font-medium bg-white/10 py-1 px-2 rounded-lg inline-block">
                    {format(parseDate(event.startDate), 'd. MMM')}
                    {event.type === 'Period' && ` - ${format(parseDate(event.endDate), 'd. MMM')}`}
                  </div>
               </div>
             </div>
           );
        })()}
      </div>
    </div>
  );
};

export default YearWheelView;

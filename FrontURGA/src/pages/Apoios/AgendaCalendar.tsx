import React, { useState } from 'react';
import type { Form } from '../../types';
import { useNavigate } from 'react-router-dom';

interface AgendaCalendarProps {
  forms: Form[];
}

export function AgendaCalendar({ forms }: AgendaCalendarProps) {
  console.log("Forms received in AgendaCalendar:", forms);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getFormsForDate = (date: number) => {
    return forms.filter(f => {
      if (!f.data_operacao) return false;
      let d, m, y;
      if (f.data_operacao.includes('/')) {
        [d, m, y] = f.data_operacao.split('/');
      } else if (f.data_operacao.includes('-')) {
        const parts = f.data_operacao.split('T')[0].split('-');
        if (parts[0].length === 4) {
          [y, m, d] = parts;
        } else {
          [d, m, y] = parts;
        }
      } else {
        return false;
      }
      return parseInt(d, 10) === date && parseInt(m, 10) === currentMonth + 1 && parseInt(y, 10) === currentYear;
    });
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e4e4e7', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={prevMonth}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e4e4e7', background: '#fff', cursor: 'pointer', fontWeight: '500' }}
        >
          Anterior
        </button>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#09090b', textTransform: 'capitalize' }}>
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          onClick={nextMonth}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e4e4e7', background: '#fff', cursor: 'pointer', fontWeight: '500' }}
        >
          Próximo
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e4e4e7' }}>
        {weekDays.map(day => (
          <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#71717a', borderRight: '1px solid #e4e4e7' }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, auto)' }}>
        {blanks.map(blank => (
          <div key={`blank-${blank}`} style={{ background: '#fafafa', borderRight: '1px solid #e4e4e7', borderBottom: '1px solid #e4e4e7' }} />
        ))}
        {days.map(day => {
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const dayForms = getFormsForDate(day);
          
          return (
            <div key={day} style={{ 
              padding: '8px', 
              borderRight: '1px solid #e4e4e7', 
              borderBottom: '1px solid #e4e4e7',
              background: isToday ? '#e0f2fe' : '#ffffff',
              position: 'relative'
            }}>
              <div style={{ 
                fontWeight: isToday ? '700' : '500', 
                color: isToday ? '#0284c7' : '#3f3f46',
                marginBottom: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isToday ? '#bae6fd' : 'transparent'
              }}>
                {day}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayForms.map(form => (
                  <div 
                    key={form.id || Math.random()} 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/visualizar-pedido/${form.id}`, { state: { returnTab: 'agenda' } });
                    }}
                    style={{ 
                      fontSize: '11px', 
                      background: form.status === 'pendente' ? '#fee2e2' : form.status === 'ciente' ? '#fef9c3' : '#dcfce7', 
                      color: form.status === 'pendente' ? '#991b1b' : form.status === 'ciente' ? '#854d0e' : '#166534', 
                      border: `1px solid ${form.status === 'pendente' ? '#fca5a5' : form.status === 'ciente' ? '#fde047' : '#86efac'}`,
                      padding: '4px 6px', 
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                    title={form.operacao}
                  >
                    {form.operacao}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

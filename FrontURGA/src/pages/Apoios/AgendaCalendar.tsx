import { useState } from 'react';
import type { Form } from '../../types';
import { useNavigate } from 'react-router-dom';

interface AgendaCalendarProps {
  forms: Form[];
}

export function AgendaCalendar({ forms }: AgendaCalendarProps) {
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
      // Se não houver data da operação, utiliza a data em que o pedido foi solicitado
      const targetDate = f.data_operacao || f.createdAt;
      if (!targetDate) return false;

      let d, m, y;
      if (targetDate.includes('/')) {
        [d, m, y] = targetDate.split('/');
      } else if (targetDate.includes('-')) {
        const parts = targetDate.split('T')[0].split('-');
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        gridTemplateRows: 'auto',
        gridAutoRows: 'minmax(120px, auto)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Cabeçalho dos Dias da Semana */}
        {weekDays.map((day, idx) => (
          <div key={day} style={{
            padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#71717a',
            borderRight: idx === 6 ? 'none' : '1px solid #e4e4e7',
            borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
            {day}
          </div>
        ))}

        {/* Espaços vazios no início do mês */}
        {blanks.map(blank => (
          <div key={`blank-${blank}`} style={{
            background: '#fafafa',
            borderRight: (blank % 7 === 6) ? 'none' : '1px solid #e4e4e7',
            borderBottom: '1px solid #e4e4e7',
            boxSizing: 'border-box'
          }} />
        ))}

        {/* Dias do mês */}
        {days.map(day => {
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const dayForms = getFormsForDate(day);
          const currentWeekdayIndex = (firstDayOfMonth + day - 1) % 7;

          return (
            <div key={day} style={{
              padding: '8px',
              borderRight: currentWeekdayIndex === 6 ? 'none' : '1px solid #e4e4e7',
              borderBottom: '1px solid #e4e4e7',
              background: isToday ? '#e0f2fe' : '#ffffff',
              position: 'relative',
              boxSizing: 'border-box'
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
                      fontWeight: '600',
                      boxSizing: 'border-box'
                    }}
                    title={!form.data_operacao ? `${form.operacao} (Data da operação não informada - Exibido na data da solicitação)` : form.operacao}
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

import { useState } from 'react';
import type { Form } from '../../types';
import { useNavigate } from 'react-router-dom';
import './AgendaCalendar.css';

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
  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="calendar-card">
      <div className="calendar-header-nav">
        <button
          onClick={prevMonth}
          className="calendar-nav-btn"
        >
          Anterior
        </button>
        <h3 className="calendar-month-title">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={nextMonth}
          className="calendar-nav-btn"
        >
          Próximo
        </button>
      </div>

      <div className="calendar-grid">
        {/* Cabeçalho dos Dias da Semana */}
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className="calendar-weekday"
          >
            <span className="weekday-full">{day}</span>
            <span className="weekday-short">{weekDaysShort[idx]}</span>
          </div>
        ))}

        {/* Espaços vazios no início do mês */}
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="calendar-blank-cell" />
        ))}

        {/* Dias do mês */}
        {days.map(day => {
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const dayForms = getFormsForDate(day);

          return (
            <div
              key={day}
              className={`calendar-day-cell ${isToday ? 'today' : ''}`}
            >
              <div className={`calendar-day-number ${isToday ? 'today' : ''}`}>
                {day}
              </div>
              <div className="calendar-events-container">
                {dayForms.map(form => (
                  <div
                    key={form.id || Math.random()}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/visualizar-pedido/${form.id}`, { state: { returnTab: 'agenda' } });
                    }}
                    className={`calendar-event ${form.status || 'pendente'}`}
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

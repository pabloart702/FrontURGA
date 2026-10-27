import type { Form } from '../types/apoios.types';
import { useAgendaCalendar } from '../hooks/useAgendaCalendar';
import './AgendaCalendar.css';

interface AgendaCalendarProps {
  forms: Form[];
  onSelectForm?: (form: Form) => void;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WEEK_DAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function AgendaCalendar({ forms, onSelectForm }: AgendaCalendarProps) {
  const {
    currentMonth,
    currentYear,
    today,
    days,
    blanks,
    prevMonth,
    nextMonth,
    getFormsForDate,
  } = useAgendaCalendar(forms);

  return (
    <div className="calendar-card">
      <div className="calendar-header-nav">
        <button type="button" onClick={prevMonth} className="calendar-nav-btn">
          Anterior
        </button>
        <h3 className="calendar-month-title">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
        <button type="button" onClick={nextMonth} className="calendar-nav-btn">
          Próximo
        </button>
      </div>

      <div className="calendar-grid">
        {WEEK_DAYS.map((day, idx) => (
          <div key={day} className="calendar-weekday">
            <span className="weekday-full">{day}</span>
            <span className="weekday-short">{WEEK_DAYS_SHORT[idx]}</span>
          </div>
        ))}

        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="calendar-blank-cell" />
        ))}

        {days.map((day) => {
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
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
                {dayForms.map((form, idx) => {
                  const eventKey = form.id || `form-evt-${day}-${idx}`;
                  const titleText = !form.data_operacao
                    ? `${form.operacao} (Data da operação não informada - Exibido na data da solicitação)`
                    : form.operacao;

                  return (
                    <div
                      key={eventKey}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectForm?.(form);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectForm?.(form);
                        }
                      }}
                      className={`calendar-event ${form.status || 'pendente'}`}
                      title={titleText}
                    >
                      {form.operacao}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Form } from '../types/apoios.types';

export function useAgendaCalendar(forms: Form[]) {
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
    return forms.filter((f) => {
      const targetDate = f.data_operacao || f.createdAt;
      if (!targetDate) return false;

      let d: string | undefined;
      let m: string | undefined;
      let y: string | undefined;

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

      return (
        parseInt(d, 10) === date &&
        parseInt(m, 10) === currentMonth + 1 &&
        parseInt(y, 10) === currentYear
      );
    });
  };

  return {
    currentMonth,
    currentYear,
    today,
    days,
    blanks,
    prevMonth,
    nextMonth,
    getFormsForDate,
  };
}

import { format, formatDistanceToNow, isToday as dateFnsIsToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(new Date(dateString), formatStr);
};

export const formatRelative = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const isToday = (dateString: string): boolean => {
  return dateFnsIsToday(new Date(dateString));
};

export const getMonthName = (dateString: string): string => {
  return format(new Date(dateString), 'MMMM');
};

export const getDateRange = (rangeType: 'today' | 'week' | 'month' | 'year'): { start: string, end: string } => {
  const now = new Date();
  let start, end;
  
  switch (rangeType) {
    case 'today':
      start = now;
      end = now;
      break;
    case 'week':
      start = startOfWeek(now);
      end = endOfWeek(now);
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
  }
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

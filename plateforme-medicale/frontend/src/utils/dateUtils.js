import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format date as dd/MM/yyyy
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd/MM/yyyy', { locale: fr });
};

// Format date and time as dd/MM/yyyy HH:mm
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
};

// Format time as HH:mm (24-hour)
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // If timeString is already in HH:mm format, validate and return
  if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}(?::00)?$/)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
  
  try {
    // If it's a Date object or a full date string, format it
    const date = typeof timeString === 'string' ? parseISO(timeString) : timeString;
    if (date instanceof Date && !isNaN(date)) {
      return format(date, 'HH:mm');
    }
  } catch (error) {
    console.error('Error formatting time:', error);
  }
  
  // If all else fails, try to extract time from string
  if (typeof timeString === 'string') {
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})(?::00)?/);
    if (timeMatch) {
      const [_, hours, minutes] = timeMatch;
      const paddedHours = hours.padStart(2, '0');
      if (Number(hours) >= 0 && Number(hours) <= 23 && Number(minutes) >= 0 && Number(minutes) <= 59) {
        return `${paddedHours}:${minutes}`;
      }
    }
  }
  
  return '';
};

// Common props for date pickers
export const datePickerProps = {
  ampm: false,
  format: "dd/MM/yyyy"
};

// Common props for date-time pickers
export const dateTimePickerProps = {
  ampm: false,
  format: "dd/MM/yyyy HH:mm"
};

// Common props for time inputs
export const timeInputProps = {
  step: 300, // 5 minutes intervals
  type: "time"
}; 
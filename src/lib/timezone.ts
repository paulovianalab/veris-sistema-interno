/**
 * Timezone utility functions for Brasília timezone (America/Sao_Paulo)
 * Ensures consistent handling of dates and times across the application
 */

const BRASILIA_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converts a local date string and time string to UTC date
 * Assumes the input is in Brasília timezone
 * @param dateStr - Date in YYYY-MM-DD format
 * @param timeStr - Time in HH:MM format
 * @returns Date object in UTC
 */
export function localToBrasilia(dateStr: string, timeStr: string): Date {
  // Create a date string in Brasília timezone
  const localDateStr = `${dateStr}T${timeStr}:00`;
  
  // Create a date object
  const localDate = new Date(localDateStr);
  
  // Get the UTC offset for Brasília
  // We need to calculate the offset by creating a formatter
  const brasiliaFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Get the parts from Brasília timezone
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Create a test date to calculate offset
  const now = new Date();
  const testDate = new Date(now.getTime());
  
  // Get Brasília time and UTC time for the same moment
  const brasiliaTime = new Date(dateStr + 'T' + timeStr + ':00').toLocaleString('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Simple approach: parse the local time and adjust
  // The input dateStr and timeStr represent a time in Brasília
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // Create UTC date with these components
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  
  // Now we need to find what UTC time corresponds to this Brasília time
  // We'll do this by creating various UTC times and checking which one gives us the right Brasília time
  let testUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  
  // Brazil uses -3 or -2 depending on daylight saving time
  // Let's check which offset is correct for this date
  const formatter2 = new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Try -3 hours offset first (standard time)
  let resultDate = new Date(Date.UTC(year, month - 1, day, hour + 3, minute, 0));
  let brasiliaCheck = formatter2.format(resultDate);
  
  // If that doesn't match, try -2 (daylight saving)
  if (!brasiliaCheck.startsWith(dateStr.replace(/-/g, ' ').slice(0, 10))) {
    resultDate = new Date(Date.UTC(year, month - 1, day, hour + 2, minute, 0));
  }

  return resultDate;
}

/**
 * Converts a UTC date to Brasília time components
 * @param date - Date object in UTC
 * @returns Object with year, month, day, hour, minute, second in Brasília timezone
 */
export function utcToBrasilia(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dateStr: string;
  timeStr: string;
} {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const result: any = {};

  parts.forEach((part) => {
    result[part.type] = part.value;
  });

  const year = parseInt(result.year);
  const month = parseInt(result.month);
  const day = parseInt(result.day);
  const hour = parseInt(result.hour);
  const minute = parseInt(result.minute);
  const second = parseInt(result.second);

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    timeStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  };
}

/**
 * Formats a UTC date as Brasília time for display
 * @param date - Date object in UTC
 * @returns Formatted string in pt-BR locale
 */
export function formatBrasiliaTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Gets the current date and time in Brasília timezone
 * @returns Date object
 */
export function getNowInBrasilia(): Date {
  const now = new Date();
  const brasiliaTime = utcToBrasilia(now);
  return new Date(
    Date.UTC(
      brasiliaTime.year,
      brasiliaTime.month - 1,
      brasiliaTime.day,
      brasiliaTime.hour,
      brasiliaTime.minute,
      brasiliaTime.second
    )
  );
}

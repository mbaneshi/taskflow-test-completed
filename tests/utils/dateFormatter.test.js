import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatTimeAgo,
  formatDateRange,
  formatTime,
  formatMonth,
  formatYear,
  formatWeekday,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  getDaysBetween,
  getWeeksBetween,
  getMonthsBetween,
  getYearsBetween,
  addDays,
  subtractDays,
  addMonths,
  subtractMonths,
  addYears,
  subtractYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isLeapYear,
  getDaysInMonth,
  getWeekNumber,
  parseDate,
  isValidDate,
  toLocalDate,
  toUTCDate,
  formatForInput,
  formatForDisplay,
  formatForAPI,
  formatForDatabase,
} from '../../src/utils/dateFormatter';

describe('Date Formatter Utility Functions', () => {
  const testDate = new Date('2024-01-15T10:30:00Z');
  const testDate2 = new Date('2024-01-20T15:45:00Z');

  beforeEach(() => {
    // Mock current date to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatDate', () => {
    test('formats date in default format', () => {
      expect(formatDate(testDate)).toBe('Jan 15, 2024');
    });

    test('formats date in custom format', () => {
      expect(formatDate(testDate, 'MM/DD/YYYY')).toBe('01/15/2024');
      expect(formatDate(testDate, 'DD-MM-YYYY')).toBe('15-01-2024');
      expect(formatDate(testDate, 'YYYY/MM/DD')).toBe('2024/01/15');
    });

    test('handles different date formats', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('Jan 15, 2024');
      expect(formatDate(1642239000000)).toBe('Jan 15, 2024'); // Timestamp
    });

    test('handles invalid dates gracefully', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
      expect(formatDate(null)).toBe('Invalid Date');
      expect(formatDate(undefined)).toBe('Invalid Date');
    });
  });

  describe('formatDateTime', () => {
    test('formats date and time', () => {
      expect(formatDateTime(testDate)).toBe('Jan 15, 2024 at 10:30 AM');
    });

    test('formats with custom time format', () => {
      expect(formatDateTime(testDate, 'MM/DD/YYYY HH:mm')).toBe('01/15/2024 10:30');
      expect(formatDateTime(testDate, 'DD-MM-YYYY HH:mm:ss')).toBe('15-01-2024 10:30:00');
    });

    test('handles 24-hour format', () => {
      expect(formatDateTime(testDate, 'MM/DD/YYYY HH:mm', { hour12: false })).toBe('01/15/2024 10:30');
    });
  });

  describe('formatRelativeTime', () => {
    test('formats relative time for recent dates', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago');
    });

    test('formats relative time for future dates', () => {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(oneHourLater)).toBe('in 1 hour');
      expect(formatRelativeTime(oneDayLater)).toBe('in 1 day');
    });

    test('handles edge cases', () => {
      expect(formatRelativeTime(testDate)).toBe('1 hour ago');
      expect(formatRelativeTime(new Date())).toBe('just now');
    });
  });

  describe('formatDuration', () => {
    test('formats duration in milliseconds', () => {
      expect(formatDuration(1000)).toBe('1 second');
      expect(formatDuration(60000)).toBe('1 minute');
      expect(formatDuration(3600000)).toBe('1 hour');
      expect(formatDuration(86400000)).toBe('1 day');
    });

    test('formats complex durations', () => {
      expect(formatDuration(90061000)).toBe('1 day, 1 hour, 1 minute, 1 second');
      expect(formatDuration(3661000)).toBe('1 hour, 1 minute, 1 second');
    });

    test('handles zero and negative values', () => {
      expect(formatDuration(0)).toBe('0 seconds');
      expect(formatDuration(-1000)).toBe('1 second ago');
    });
  });

  describe('formatTimeAgo', () => {
    test('formats time ago for past dates', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(oneHourAgo)).toBe('1 hour ago');
      expect(formatTimeAgo(oneDayAgo)).toBe('1 day ago');
    });

    test('formats time ago for future dates', () => {
      const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
      const oneDayLater = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      expect(formatTimeAgo(oneHourLater)).toBe('in 1 hour');
      expect(formatTimeAgo(oneDayLater)).toBe('in 1 day');
    });
  });

  describe('formatDateRange', () => {
    test('formats date range', () => {
      expect(formatDateRange(testDate, testDate2)).toBe('Jan 15 - Jan 20, 2024');
    });

    test('formats same day range', () => {
      expect(formatDateRange(testDate, testDate)).toBe('Jan 15, 2024');
    });

    test('formats different year range', () => {
      const date1 = new Date('2023-12-31');
      const date2 = new Date('2024-01-01');
      expect(formatDateRange(date1, date2)).toBe('Dec 31, 2023 - Jan 1, 2024');
    });
  });

  describe('formatTime', () => {
    test('formats time in 12-hour format', () => {
      expect(formatTime(testDate)).toBe('10:30 AM');
      expect(formatTime(new Date('2024-01-15T15:45:00Z'))).toBe('3:45 PM');
    });

    test('formats time in 24-hour format', () => {
      expect(formatTime(testDate, { hour12: false })).toBe('10:30');
      expect(formatTime(new Date('2024-01-15T15:45:00Z'), { hour12: false })).toBe('15:45');
    });

    test('formats time with seconds', () => {
      expect(formatTime(testDate, { showSeconds: true })).toBe('10:30:00 AM');
    });
  });

  describe('formatMonth', () => {
    test('formats month names', () => {
      expect(formatMonth(testDate)).toBe('January');
      expect(formatMonth(testDate, 'short')).toBe('Jan');
      expect(formatMonth(testDate, 'numeric')).toBe('01');
    });

    test('handles different month formats', () => {
      const julyDate = new Date('2024-07-15');
      expect(formatMonth(julyDate)).toBe('July');
      expect(formatMonth(julyDate, 'short')).toBe('Jul');
      expect(formatMonth(julyDate, 'numeric')).toBe('07');
    });
  });

  describe('formatYear', () => {
    test('formats year', () => {
      expect(formatYear(testDate)).toBe('2024');
    });

    test('formats year with different formats', () => {
      expect(formatYear(testDate, 'short')).toBe('24');
      expect(formatYear(testDate, 'full')).toBe('2024');
    });
  });

  describe('formatWeekday', () => {
    test('formats weekday names', () => {
      expect(formatWeekday(testDate)).toBe('Monday');
      expect(formatWeekday(testDate, 'short')).toBe('Mon');
      expect(formatWeekday(testDate, 'numeric')).toBe('1');
    });
  });

  describe('Date comparison functions', () => {
    test('isToday', () => {
      expect(isToday(new Date())).toBe(true);
      expect(isToday(testDate)).toBe(false);
    });

    test('isYesterday', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isYesterday(yesterday)).toBe(true);
      expect(isYesterday(testDate)).toBe(false);
    });

    test('isTomorrow', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(isTomorrow(tomorrow)).toBe(true);
      expect(isTomorrow(testDate)).toBe(false);
    });

    test('isThisWeek', () => {
      expect(isThisWeek(testDate)).toBe(true);
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      expect(isThisWeek(nextWeek)).toBe(false);
    });

    test('isThisMonth', () => {
      expect(isThisMonth(testDate)).toBe(true);
      const nextMonth = new Date('2024-02-15');
      expect(isThisMonth(nextMonth)).toBe(false);
    });

    test('isThisYear', () => {
      expect(isThisYear(testDate)).toBe(true);
      const nextYear = new Date('2025-01-15');
      expect(isThisYear(nextYear)).toBe(false);
    });
  });

  describe('Date calculation functions', () => {
    test('getDaysBetween', () => {
      expect(getDaysBetween(testDate, testDate2)).toBe(5);
      expect(getDaysBetween(testDate, testDate)).toBe(0);
    });

    test('getWeeksBetween', () => {
      expect(getWeeksBetween(testDate, testDate2)).toBe(0); // Same week
      const nextWeek = new Date('2024-01-22');
      expect(getWeeksBetween(testDate, nextWeek)).toBe(1);
    });

    test('getMonthsBetween', () => {
      expect(getMonthsBetween(testDate, testDate2)).toBe(0); // Same month
      const nextMonth = new Date('2024-02-15');
      expect(getMonthsBetween(testDate, nextMonth)).toBe(1);
    });

    test('getYearsBetween', () => {
      expect(getYearsBetween(testDate, testDate2)).toBe(0); // Same year
      const nextYear = new Date('2025-01-15');
      expect(getYearsBetween(testDate, nextYear)).toBe(1);
    });
  });

  describe('Date manipulation functions', () => {
    test('addDays', () => {
      const result = addDays(testDate, 5);
      expect(result.getDate()).toBe(20);
    });

    test('subtractDays', () => {
      const result = subtractDays(testDate, 5);
      expect(result.getDate()).toBe(10);
    });

    test('addMonths', () => {
      const result = addMonths(testDate, 2);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
    });

    test('subtractMonths', () => {
      const result = subtractMonths(testDate, 2);
      expect(result.getMonth()).toBe(10); // November (0-indexed)
    });

    test('addYears', () => {
      const result = addYears(testDate, 1);
      expect(result.getFullYear()).toBe(2025);
    });

    test('subtractYears', () => {
      const result = subtractYears(testDate, 1);
      expect(result.getFullYear()).toBe(2023);
    });
  });

  describe('Date boundary functions', () => {
    test('startOfDay', () => {
      const result = startOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });

    test('endOfDay', () => {
      const result = endOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });

    test('startOfWeek', () => {
      const result = startOfWeek(testDate);
      expect(result.getDay()).toBe(0); // Sunday
    });

    test('endOfWeek', () => {
      const result = endOfWeek(testDate);
      expect(result.getDay()).toBe(6); // Saturday
    });

    test('startOfMonth', () => {
      const result = startOfMonth(testDate);
      expect(result.getDate()).toBe(1);
    });

    test('endOfMonth', () => {
      const result = endOfMonth(testDate);
      expect(result.getDate()).toBe(31); // January has 31 days
    });

    test('startOfYear', () => {
      const result = startOfYear(testDate);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });

    test('endOfYear', () => {
      const result = endOfYear(testDate);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(31);
    });
  });

  describe('Date utility functions', () => {
    test('isLeapYear', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2100)).toBe(false);
    });

    test('getDaysInMonth', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29); // February 2024 (leap year)
      expect(getDaysInMonth(2023, 1)).toBe(28); // February 2023
      expect(getDaysInMonth(2024, 0)).toBe(31); // January
      expect(getDaysInMonth(2024, 3)).toBe(30); // April
    });

    test('getWeekNumber', () => {
      expect(getWeekNumber(testDate)).toBe(3); // Third week of 2024
    });
  });

  describe('Date parsing and validation', () => {
    test('parseDate', () => {
      expect(parseDate('2024-01-15')).toEqual(new Date('2024-01-15'));
      expect(parseDate('2024-01-15T10:30:00Z')).toEqual(new Date('2024-01-15T10:30:00Z'));
      expect(parseDate('01/15/2024')).toEqual(new Date('2024-01-15'));
    });

    test('isValidDate', () => {
      expect(isValidDate(testDate)).toBe(true);
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe('Date conversion functions', () => {
    test('toLocalDate', () => {
      const result = toLocalDate(testDate);
      expect(result).toBeInstanceOf(Date);
      // Note: Actual values depend on timezone
    });

    test('toUTCDate', () => {
      const result = toUTCDate(testDate);
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCHours()).toBe(10);
      expect(result.getUTCMinutes()).toBe(30);
    });
  });

  describe('Formatting for specific use cases', () => {
    test('formatForInput', () => {
      expect(formatForInput(testDate)).toBe('2024-01-15');
    });

    test('formatForDisplay', () => {
      expect(formatForDisplay(testDate)).toBe('Jan 15, 2024');
    });

    test('formatForAPI', () => {
      expect(formatForAPI(testDate)).toBe('2024-01-15T10:30:00.000Z');
    });

    test('formatForDatabase', () => {
      expect(formatForDatabase(testDate)).toBe('2024-01-15 10:30:00');
    });
  });

  describe('Edge cases and error handling', () => {
    test('handles null and undefined', () => {
      expect(formatDate(null)).toBe('Invalid Date');
      expect(formatDate(undefined)).toBe('Invalid Date');
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });

    test('handles invalid date strings', () => {
      expect(formatDate('not-a-date')).toBe('Invalid Date');
      expect(isValidDate('not-a-date')).toBe(false);
    });

    test('handles very old dates', () => {
      const oldDate = new Date('1900-01-01');
      expect(formatDate(oldDate)).toBe('Jan 1, 1900');
    });

    test('handles very future dates', () => {
      const futureDate = new Date('2100-01-01');
      expect(formatDate(futureDate)).toBe('Jan 1, 2100');
    });

    test('handles timezone edge cases', () => {
      const utcDate = new Date('2024-01-15T00:00:00Z');
      const localDate = new Date('2024-01-15T00:00:00');
      
      expect(formatDate(utcDate)).toBe('Jan 15, 2024');
      expect(formatDate(localDate)).toBe('Jan 15, 2024');
    });
  });

  describe('Performance and memory', () => {
    test('handles large date ranges efficiently', () => {
      const startDate = new Date('2000-01-01');
      const endDate = new Date('2024-01-01');
      
      const startTime = performance.now();
      const days = getDaysBetween(startDate, endDate);
      const endTime = performance.now();
      
      expect(days).toBe(8766); // Approximate days between dates
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    test('handles multiple date operations', () => {
      const dates = Array.from({ length: 1000 }, (_, i) => new Date(2024, 0, i + 1));
      
      const startTime = performance.now();
      dates.forEach(date => formatDate(date));
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});

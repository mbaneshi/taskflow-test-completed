import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateLength,
  validateDate,
  validateUrl,
  validatePhoneNumber,
  validateUsername,
  validateTaskTitle,
  validateTaskDescription,
  validatePriority,
  validateStatus,
  validateTags,
  validateAssignee,
  validateDueDate,
  validateFileSize,
  validateFileType,
  validateNumeric,
  validateAlphanumeric,
  validateSpecialCharacters,
  validateJson,
  validateUuid,
  validateIpAddress,
  validateCreditCard,
  validatePostalCode,
  validateCurrency,
} from '../../src/utils/validators';

describe('Validators Utility Functions', () => {
  describe('validateEmail', () => {
    test('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('123@456.789')).toBe(true);
      expect(validateEmail('a@b.c')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    test('handles edge cases', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test@example..com')).toBe(false);
      expect(validateEmail('test@example.com.')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
      expect(validatePassword('Complex@Password1')).toBe(true);
      expect(validatePassword('MyP@ssw0rd')).toBe(true);
    });

    test('rejects weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('abcdefgh')).toBe(false);
      expect(validatePassword('ABCDEFGH')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });

    test('enforces minimum requirements', () => {
      // Too short
      expect(validatePassword('Abc1!')).toBe(false);
      // No uppercase
      expect(validatePassword('lowercase123!')).toBe(false);
      // No lowercase
      expect(validatePassword('UPPERCASE123!')).toBe(false);
      // No number
      expect(validatePassword('NoNumbers!')).toBe(false);
      // No special character
      expect(validatePassword('NoSpecial123')).toBe(false);
    });

    test('handles custom requirements', () => {
      const customValidator = (password) => validatePassword(password, { minLength: 10 });
      expect(customValidator('LongPass123!')).toBe(true);
      expect(customValidator('Short1!')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    test('validates required fields', () => {
      expect(validateRequired('value')).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
      expect(validateRequired([])).toBe(true);
      expect(validateRequired({})).toBe(true);
    });

    test('rejects empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    test('handles whitespace correctly', () => {
      expect(validateRequired('  value  ')).toBe(true);
      expect(validateRequired('   ')).toBe(false);
    });
  });

  describe('validateLength', () => {
    test('validates string length within range', () => {
      expect(validateLength('test', { min: 1, max: 10 })).toBe(true);
      expect(validateLength('test', { min: 4, max: 4 })).toBe(true);
      expect(validateLength('test', { min: 0, max: 10 })).toBe(true);
    });

    test('rejects strings outside range', () => {
      expect(validateLength('test', { min: 5, max: 10 })).toBe(false);
      expect(validateLength('test', { min: 1, max: 3 })).toBe(false);
    });

    test('handles edge cases', () => {
      expect(validateLength('', { min: 0, max: 10 })).toBe(true);
      expect(validateLength('', { min: 1, max: 10 })).toBe(false);
      expect(validateLength(null, { min: 0, max: 10 })).toBe(false);
    });

    test('works with only min constraint', () => {
      expect(validateLength('test', { min: 3 })).toBe(true);
      expect(validateLength('test', { min: 5 })).toBe(false);
    });

    test('works with only max constraint', () => {
      expect(validateLength('test', { max: 5 })).toBe(true);
      expect(validateLength('test', { max: 3 })).toBe(false);
    });
  });

  describe('validateDate', () => {
    test('validates valid dates', () => {
      expect(validateDate('2024-12-31')).toBe(true);
      expect(validateDate('2024-01-01')).toBe(true);
      expect(validateDate('2024-02-29')).toBe(true); // Leap year
    });

    test('rejects invalid dates', () => {
      expect(validateDate('2024-13-01')).toBe(false);
      expect(validateDate('2024-02-30')).toBe(false);
      expect(validateDate('2024-04-31')).toBe(false);
      expect(validateDate('invalid-date')).toBe(false);
      expect(validateDate('')).toBe(false);
    });

    test('validates date ranges', () => {
      const futureValidator = (date) => validateDate(date, { min: new Date() });
      const pastValidator = (date) => validateDate(date, { max: new Date() });
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      expect(futureValidator(futureDate.toISOString().split('T')[0])).toBe(true);
      expect(futureValidator(pastDate.toISOString().split('T')[0])).toBe(false);
      expect(pastValidator(pastDate.toISOString().split('T')[0])).toBe(true);
      expect(pastValidator(futureDate.toISOString().split('T')[0])).toBe(false);
    });
  });

  describe('validateUrl', () => {
    test('validates correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://www.example.com/path')).toBe(true);
      expect(validateUrl('https://example.com/path?param=value')).toBe(true);
      expect(validateUrl('https://example.com/path#fragment')).toBe(true);
    });

    test('rejects invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });

    test('handles protocol requirements', () => {
      const httpsOnly = (url) => validateUrl(url, { protocols: ['https'] });
      expect(httpsOnly('https://example.com')).toBe(true);
      expect(httpsOnly('http://example.com')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    test('validates phone numbers', () => {
      expect(validatePhoneNumber('+1-555-123-4567')).toBe(true);
      expect(validatePhoneNumber('555-123-4567')).toBe(true);
      expect(validatePhoneNumber('(555) 123-4567')).toBe(true);
      expect(validatePhoneNumber('555.123.4567')).toBe(true);
      expect(validatePhoneNumber('5551234567')).toBe(true);
    });

    test('rejects invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('not-a-number')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
    });

    test('handles international formats', () => {
      expect(validatePhoneNumber('+44 20 7946 0958')).toBe(true);
      expect(validatePhoneNumber('+81 3-1234-5678')).toBe(true);
    });
  });

  describe('validateUsername', () => {
    test('validates valid usernames', () => {
      expect(validateUsername('john_doe')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('john.doe')).toBe(true);
      expect(validateUsername('john-doe')).toBe(true);
    });

    test('rejects invalid usernames', () => {
      expect(validateUsername('john doe')).toBe(false); // Space
      expect(validateUsername('john@doe')).toBe(false); // Special char
      expect(validateUsername('')).toBe(false);
      expect(validateUsername('a')).toBe(false); // Too short
    });

    test('enforces length constraints', () => {
      const longUsername = 'a'.repeat(21);
      expect(validateUsername(longUsername)).toBe(false);
    });
  });

  describe('validateTaskTitle', () => {
    test('validates valid task titles', () => {
      expect(validateTaskTitle('Fix login bug')).toBe(true);
      expect(validateTaskTitle('Update documentation')).toBe(true);
      expect(validateTaskTitle('A'.repeat(100))).toBe(true); // Max length
    });

    test('rejects invalid task titles', () => {
      expect(validateTaskTitle('')).toBe(false);
      expect(validateTaskTitle('A'.repeat(101))).toBe(false); // Too long
      expect(validateTaskTitle('   ')).toBe(false); // Only whitespace
    });
  });

  describe('validateTaskDescription', () => {
    test('validates valid descriptions', () => {
      expect(validateTaskDescription('This is a valid description')).toBe(true);
      expect(validateTaskDescription('A'.repeat(1000))).toBe(true); // Max length
    });

    test('rejects invalid descriptions', () => {
      expect(validateTaskDescription('A'.repeat(1001))).toBe(false); // Too long
    });
  });

  describe('validatePriority', () => {
    test('validates valid priorities', () => {
      expect(validatePriority('low')).toBe(true);
      expect(validatePriority('medium')).toBe(true);
      expect(validatePriority('high')).toBe(true);
      expect(validatePriority('urgent')).toBe(true);
    });

    test('rejects invalid priorities', () => {
      expect(validatePriority('invalid')).toBe(false);
      expect(validatePriority('')).toBe(false);
      expect(validatePriority('HIGH')).toBe(false); // Case sensitive
    });
  });

  describe('validateStatus', () => {
    test('validates valid statuses', () => {
      expect(validateStatus('pending')).toBe(true);
      expect(validateStatus('in-progress')).toBe(true);
      expect(validateStatus('completed')).toBe(true);
      expect(validateStatus('cancelled')).toBe(true);
      expect(validateStatus('on-hold')).toBe(true);
    });

    test('rejects invalid statuses', () => {
      expect(validateStatus('invalid')).toBe(false);
      expect(validateStatus('')).toBe(false);
      expect(validateStatus('IN-PROGRESS')).toBe(false); // Case sensitive
    });
  });

  describe('validateTags', () => {
    test('validates valid tags', () => {
      expect(validateTags(['frontend', 'bug'])).toBe(true);
      expect(validateTags([])).toBe(true);
      expect(validateTags(['single-tag'])).toBe(true);
    });

    test('rejects invalid tags', () => {
      expect(validateTags([''])).toBe(false);
      expect(validateTags(['tag with space'])).toBe(false);
      expect(validateTags(['tag@with@special'])).toBe(false);
      expect(validateTags(['a'.repeat(51)])).toBe(false); // Too long
    });

    test('enforces tag limits', () => {
      const manyTags = Array.from({ length: 11 }, (_, i) => `tag${i}`);
      expect(validateTags(manyTags)).toBe(false); // Too many tags
    });
  });

  describe('validateAssignee', () => {
    test('validates valid assignees', () => {
      expect(validateAssignee('john@example.com')).toBe(true);
      expect(validateAssignee('')).toBe(true); // Unassigned is valid
    });

    test('rejects invalid assignees', () => {
      expect(validateAssignee('invalid-email')).toBe(false);
      expect(validateAssignee('john@')).toBe(false);
      expect(validateAssignee('@example.com')).toBe(false);
    });
  });

  describe('validateDueDate', () => {
    test('validates future due dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      expect(validateDueDate(tomorrowString)).toBe(true);
    });

    test('rejects past due dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      expect(validateDueDate(yesterdayString)).toBe(false);
    });

    test('rejects invalid dates', () => {
      expect(validateDueDate('invalid-date')).toBe(false);
      expect(validateDueDate('')).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    test('validates file sizes within limit', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(validateFileSize(file, 1024)).toBe(true); // 7 bytes < 1KB
    });

    test('rejects files exceeding size limit', () => {
      const largeContent = 'x'.repeat(1025);
      const largeFile = new File([largeContent], 'large.txt', { type: 'text/plain' });
      expect(validateFileSize(largeFile, 1024)).toBe(false);
    });

    test('handles edge cases', () => {
      expect(validateFileSize(null, 1024)).toBe(false);
      expect(validateFileSize(undefined, 1024)).toBe(false);
    });
  });

  describe('validateFileType', () => {
    test('validates allowed file types', () => {
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const pdfFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      
      expect(validateFileType(txtFile, ['.txt', '.pdf'])).toBe(true);
      expect(validateFileType(pdfFile, ['.txt', '.pdf'])).toBe(true);
    });

    test('rejects disallowed file types', () => {
      const jpgFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      expect(validateFileType(jpgFile, ['.txt', '.pdf'])).toBe(false);
    });

    test('handles case sensitivity', () => {
      const txtFile = new File(['content'], 'test.TXT', { type: 'text/plain' });
      expect(validateFileType(txtFile, ['.txt'])).toBe(false); // Case sensitive by default
    });
  });

  describe('validateNumeric', () => {
    test('validates numeric values', () => {
      expect(validateNumeric('123')).toBe(true);
      expect(validateNumeric('123.45')).toBe(true);
      expect(validateNumeric('-123')).toBe(true);
      expect(validateNumeric('0')).toBe(true);
    });

    test('rejects non-numeric values', () => {
      expect(validateNumeric('abc')).toBe(false);
      expect(validateNumeric('12a34')).toBe(false);
      expect(validateNumeric('')).toBe(false);
    });
  });

  describe('validateAlphanumeric', () => {
    test('validates alphanumeric strings', () => {
      expect(validateAlphanumeric('abc123')).toBe(true);
      expect(validateAlphanumeric('ABC123')).toBe(true);
      expect(validateAlphanumeric('123abc')).toBe(true);
    });

    test('rejects strings with special characters', () => {
      expect(validateAlphanumeric('abc-123')).toBe(false);
      expect(validateAlphanumeric('abc_123')).toBe(false);
      expect(validateAlphanumeric('abc 123')).toBe(false);
    });
  });

  describe('validateSpecialCharacters', () => {
    test('validates strings with allowed special characters', () => {
      expect(validateSpecialCharacters('test@example.com')).toBe(true);
      expect(validateSpecialCharacters('user-name_123')).toBe(true);
    });

    test('rejects strings with disallowed special characters', () => {
      expect(validateSpecialCharacters('test<script>')).toBe(false);
      expect(validateSpecialCharacters('test"quote')).toBe(false);
    });
  });

  describe('validateJson', () => {
    test('validates valid JSON strings', () => {
      expect(validateJson('{"key": "value"}')).toBe(true);
      expect(validateJson('[1, 2, 3]')).toBe(true);
      expect(validateJson('null')).toBe(true);
    });

    test('rejects invalid JSON strings', () => {
      expect(validateJson('{"key": "value"')).toBe(false);
      expect(validateJson('invalid json')).toBe(false);
      expect(validateJson('')).toBe(false);
    });
  });

  describe('validateUuid', () => {
    test('validates valid UUIDs', () => {
      expect(validateUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(validateUuid('00000000-0000-0000-0000-000000000000')).toBe(true);
    });

    test('rejects invalid UUIDs', () => {
      expect(validateUuid('invalid-uuid')).toBe(false);
      expect(validateUuid('123e4567-e89b-12d3-a456')).toBe(false);
      expect(validateUuid('')).toBe(false);
    });
  });

  describe('validateIpAddress', () => {
    test('validates valid IP addresses', () => {
      expect(validateIpAddress('192.168.1.1')).toBe(true);
      expect(validateIpAddress('10.0.0.1')).toBe(true);
      expect(validateIpAddress('172.16.0.1')).toBe(true);
    });

    test('rejects invalid IP addresses', () => {
      expect(validateIpAddress('256.1.2.3')).toBe(false);
      expect(validateIpAddress('1.2.3.256')).toBe(false);
      expect(validateIpAddress('1.2.3')).toBe(false);
      expect(validateIpAddress('invalid')).toBe(false);
    });
  });

  describe('validateCreditCard', () => {
    test('validates valid credit card numbers', () => {
      expect(validateCreditCard('4532015112830366')).toBe(true); // Visa
      expect(validateCreditCard('5555555555554444')).toBe(true); // Mastercard
      expect(validateCreditCard('378282246310005')).toBe(true); // Amex
    });

    test('rejects invalid credit card numbers', () => {
      expect(validateCreditCard('1234567890123456')).toBe(false);
      expect(validateCreditCard('123')).toBe(false);
      expect(validateCreditCard('invalid')).toBe(false);
    });
  });

  describe('validatePostalCode', () => {
    test('validates valid postal codes', () => {
      expect(validatePostalCode('12345')).toBe(true); // US
      expect(validatePostalCode('A1B2C3')).toBe(true); // Canada
      expect(validatePostalCode('SW1A1AA')).toBe(true); // UK
    });

    test('rejects invalid postal codes', () => {
      expect(validatePostalCode('123')).toBe(false);
      expect(validatePostalCode('invalid')).toBe(false);
      expect(validatePostalCode('')).toBe(false);
    });
  });

  describe('validateCurrency', () => {
    test('validates valid currency amounts', () => {
      expect(validateCurrency('123.45')).toBe(true);
      expect(validateCurrency('0.99')).toBe(true);
      expect(validateCurrency('1000')).toBe(true);
      expect(validateCurrency('$123.45')).toBe(true);
    });

    test('rejects invalid currency amounts', () => {
      expect(validateCurrency('123.456')).toBe(false); // Too many decimal places
      expect(validateCurrency('-123.45')).toBe(false); // Negative
      expect(validateCurrency('abc')).toBe(false);
    });
  });
});

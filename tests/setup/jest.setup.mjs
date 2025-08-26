/**
 * Jest Setup File
 * Complete setup for TypeScript and React testing
 */

// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Basic polyfills
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

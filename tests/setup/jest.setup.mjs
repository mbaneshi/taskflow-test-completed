/**
 * Jest Setup File
 * Minimal setup to avoid module linking issues
 */

// Basic polyfills
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

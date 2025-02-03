import crypto from 'crypto';

const NUMERIC_CHARS = '0123456789';

/**
 * Generates a numeric short ID of specified length using cryptographically secure random numbers
 * @param length Length of the ID to generate (default: 15)
 * @returns A string containing only numeric characters
 */
export const getNumericShortId = (length: number = 15): string => {
    // Create a buffer to store random bytes
    const buffer = crypto.randomBytes(length);
    
    // Convert random bytes to numeric characters
    let result = '';
    for (let i = 0; i < length; i++) {
        result += NUMERIC_CHARS[buffer[i] % NUMERIC_CHARS.length];
    }
    
    return result;
};

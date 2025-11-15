// src/utils/formatters.js

/**
 * Formats a number as a currency string for display.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0.00';
    }
    // Formats as US Dollars with 2 decimal places, aligning with common commerce systems.
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Formats an ISO date string (from the backend) into a readable format.
 * @param {string} isoDate
 * @returns {string}
 */
export const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    try {
        return new Date(isoDate).toLocaleDateString('en-US');
    } catch {
        return isoDate; // Return original if parsing fails
    }
};
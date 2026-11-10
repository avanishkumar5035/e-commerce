// Validation utility for real email and mobile numbers

// Validates real email address structure and domain
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim().toLowerCase();

    // Standard RFC-compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmed)) return false;

    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;

    // Check minimum lengths
    if (local.length < 1 || local.length > 64) return false;
    if (domain.length < 4 || domain.length > 255) return false;

    // Check domain has valid TLD (at least 2 letters, e.g., .com, .in, .org)
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    const tld = domainParts[domainParts.length - 1];
    if (!/^[a-zA-Z]{2,24}$/.test(tld)) return false;

    // Reject obvious fake/dummy domains
    const fakeDomains = ['test.com', 'example.com', 'mailinator.com', 'fake.com', 'dummy.com', 'temp.com'];
    if (fakeDomains.includes(domain)) return false;

    return true;
}

// Validates real 10-digit Indian mobile number
function isValidMobileNumber(mobile) {
    if (!mobile || typeof mobile !== 'string') return false;
    // Remove spaces, hyphens, or country codes like +91
    let cleaned = mobile.trim().replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91')) {
        cleaned = cleaned.slice(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
        cleaned = cleaned.slice(1);
    }

    // Must be exactly 10 digits starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(cleaned)) return false;

    // Reject repetitive fake numbers (e.g., 9999999999, 8888888888)
    const allSame = /^(\d)\1{9}$/.test(cleaned);
    if (allSame) return false;

    // Reject sequence fake numbers
    if (cleaned === '9876543210' || cleaned === '6789012345') return false;

    return true;
}

// Helper to format clean mobile number
function cleanMobileNumber(mobile) {
    if (!mobile) return '';
    let cleaned = mobile.trim().replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91')) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.slice(2);
    else if (cleaned.startsWith('0') && cleaned.length === 11) cleaned = cleaned.slice(1);
    return cleaned;
}

module.exports = {
    isValidEmail,
    isValidMobileNumber,
    cleanMobileNumber,
};


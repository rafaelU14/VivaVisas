const RFC5322_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function normalizeEmail(email) {
  if (typeof email !== 'string') return null;
  const cleaned = email.trim().toLowerCase();
  if (!RFC5322_EMAIL_REGEX.test(cleaned)) {
    return null;
  }
  return cleaned;
}

export function cleanPhoneNumber(phone) {
  if (typeof phone !== 'string') return '';
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

export function validatePhoneNumber(phone) {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return false;

  const ecuadorRegex = /^(\+593|0)9\d{8}$/;
  if (ecuadorRegex.test(cleaned)) {
    return true;
  }

  const digits = cleaned.replace(/\D/g, '');
  if (cleaned.startsWith('+')) {
    return digits.length >= 10 && digits.length <= 15;
  }

  return digits.length >= 9 && digits.length <= 10;
}

export function normalizeEcuadorianPhone(phone) {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.startsWith('09') && cleaned.length === 10) {
    return `+593${cleaned.slice(1)}`;
  }
  return cleaned;
}

export function validateEcuadorianId(id) {
  if (typeof id !== 'string') return false;
  const cleaned = id.trim();
  if (!/^\d{10}$/.test(cleaned)) return false;

  const province = parseInt(cleaned.slice(0, 2), 10);
  if ((province < 1 || province > 24) && province !== 30) return false;

  const thirdDigit = parseInt(cleaned[2], 10);
  if (thirdDigit >= 6) return false;

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let val = parseInt(cleaned[i], 10) * coefficients[i];
    if (val >= 10) val -= 9;
    sum += val;
  }

  const verifier = (10 - (sum % 10)) % 10;
  return verifier === parseInt(cleaned[9], 10);
}

export function validatePassport(passport) {
  if (typeof passport !== 'string') return false;
  const cleaned = passport.trim();
  return /^[a-zA-Z0-9]{6,20}$/.test(cleaned);
}

export function validateClientDocument(document) {
  if (typeof document !== 'string') return false;
  const cleaned = document.trim();
  if (/^\d{10}$/.test(cleaned)) {
    return validateEcuadorianId(cleaned);
  }
  return validatePassport(cleaned);
}
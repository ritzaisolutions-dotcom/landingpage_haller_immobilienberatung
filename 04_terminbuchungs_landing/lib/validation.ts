const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6;
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}

export type FieldErrors = {
  name?: string;
  email?: string;
  telefon?: string;
};

export function validateContact(name: string, email: string, telefon: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!isValidName(name)) errors.name = "Bitte geben Sie Ihren Namen ein.";
  if (!isValidEmail(email)) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  if (!isValidPhone(telefon)) errors.telefon = "Bitte geben Sie eine gültige Telefonnummer ein.";
  return errors;
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

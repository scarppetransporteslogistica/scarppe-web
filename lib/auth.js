const COOKIE_NAME = "scarppe_admin_session";

function getSecret() {
  return process.env.ADMIN_SECRET || "dev-secret-change-me";
}

function getPassword() {
  return process.env.ADMIN_PASSWORD || "scarppe2026";
}

export function checkPassword(password) {
  return password === getPassword();
}

// Edge-runtime-safe token (no Node crypto, works in middleware).
export function expectedToken() {
  return `scarppe::${getPassword()}::${getSecret()}`;
}

export function isValidToken(token) {
  if (!token) return false;
  return token === expectedToken();
}

export { COOKIE_NAME };

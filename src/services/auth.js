const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/auth';

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = JSON.parse(text).message ?? msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204 || !text) return null;
  return JSON.parse(text);
}

export const authApi = {
  register: (email, password) => post('/register', { email, password }),
  login:    (email, password) => post('/login',    { email, password }),
  forgotPassword: (email)     => post('/forgot-password', { email }),
  resetPassword:  (token, newPassword) => post('/reset-password', { token, newPassword }),
};

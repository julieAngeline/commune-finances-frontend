const ODOO_DB = 'CUF';
const KEY = 'odoo_user';

async function rpc(url, params = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params,
      id: Date.now(),
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(
      data.error.data?.message ||
      data.error.message ||
      'Erreur Odoo'
    );
  }

  return data.result;
}

// ---------- AUTHENTIFICATION ----------
export async function loginOdoo(login, password) {
  const result = await rpc('/web/session/authenticate', {
    db: ODOO_DB,
    login,
    password,
  });

  if (!result || !result.uid) {
    throw new Error('Identifiants Odoo incorrects');
  }

  return result;
}

export const saveUser = (u) => localStorage.setItem(KEY, JSON.stringify(u));
export const clearUser = () => localStorage.removeItem(KEY);

export const getSession = async () => {
  const saved = localStorage.getItem(KEY);
  if (!saved) return null;

  try {
    const res = await fetch('/web/session/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: {}, id: Date.now() }),
    });
    const data = await res.json();
    if (data.error) {
      clearUser();
      return null;
    }
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const logoutOdoo = async () => {
  clearUser();
  try {
    await rpc('/web/session/destroy');
  } catch {
    // ignoré
  }
};

// ---------- CRUD GÉNÉRIQUE ----------
export const callKw = (model, method, args = [], kwargs = {}) =>
  rpc('/web/dataset/call_kw', { model, method, args, kwargs });

export const searchRead = (model, domain = [], fields = [], extra = {}) =>
  callKw(model, 'search_read', [], { domain, fields, ...extra });

export const create = (model, vals) => callKw(model, 'create', [vals]);

export const write = (model, id, vals) => callKw(model, 'write', [[id], vals]);

export const remove = (model, id) => callKw(model, 'unlink', [[id]]);
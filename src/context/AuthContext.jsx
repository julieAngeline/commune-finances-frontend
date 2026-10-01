import { createContext, useContext, useEffect, useState } from 'react';
import { loginOdoo, getSession, logoutOdoo } from '../api/odoo';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((s) => {
        if (s && s.uid) setUser({ uid: s.uid, name: s.name || s.username });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const result = await loginOdoo(email, password);
    if (!result || !result.uid) throw new Error('Login na mot de passe diso');
    const u = { uid: result.uid, name: result.name || email };
    setUser(u);
    return u;
  };

  const logout = async () => {
    try {
      await logoutOdoo();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
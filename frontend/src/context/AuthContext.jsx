import { useEffect, useState } from 'react';
import api from '../services/api';

import { AuthContext } from './auth';
const USER_KEY = 'ptithotel.user';

function readUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
}

function saveUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch { /* Authentication still works when browser storage is unavailable. */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [loading, setLoading] = useState(true);

  function updateUser(value) {
    saveUser(value);
    setUser(value);
  }

  useEffect(() => {
    let active = true;
    // The cached profile is never trusted for authorizing access.
    api.get('/auth/me').then(({ data }) => {
      if (active) { saveUser(data); setUser(data); }
    }).catch(() => {
      if (active) { saveUser(null); setUser(null); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === USER_KEY || event.key === null) {
        // A second tab signing out must also clear this tab's UI.
        if (!readUser()) setUser(null);
      }
    }
    function onUnauthorized(error) {
      if (error.response?.status === 401) updateUser(null);
      return Promise.reject(error);
    }
    const interceptor = api.interceptors.response.use(response => response, onUnauthorized);
    window.addEventListener('storage', onStorage);
    return () => {
      api.interceptors.response.eject(interceptor);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email: email.trim(), password });
    updateUser(data);
  }

  async function register(email, password) {
    await api.post('/auth/register', { email: email.trim(), password });
  }

  async function logout() {
    await api.post('/auth/logout');
    updateUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


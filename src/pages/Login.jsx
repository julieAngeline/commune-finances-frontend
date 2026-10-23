import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const BUBBLES = [
  { left: '6%',  size: 18, dur: 14, delay: 0 },
  { left: '15%', size: 34, dur: 18, delay: 3 },
  { left: '26%', size: 12, dur: 11, delay: 6 },
  { left: '38%', size: 26, dur: 16, delay: 1 },
  { left: '49%', size: 40, dur: 20, delay: 8 },
  { left: '58%', size: 14, dur: 12, delay: 4 },
  { left: '68%', size: 30, dur: 17, delay: 2 },
  { left: '77%', size: 20, dur: 13, delay: 7 },
  { left: '86%', size: 36, dur: 19, delay: 5 },
  { left: '94%', size: 16, dur: 15, delay: 9 },
];

export default function Login() {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await doLogin(login, password);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
        <span className="blob blob-4" />
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-logo">
  <img
    src="/login.PNG"
    alt="Lapan'ny Tanàna de Fianarantsoa"
    className="login-logo-image"
  />
</div>
        <h1 className="login-title">Commune Finances</h1>
        <p className="login-subtitle">Connectez-vous pour accéder à votre espace</p>

        <label className="login-label" htmlFor="login">Email</label>
        <div className="login-field">
          <Mail size={18} />
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Votre login "
            autoComplete="username"
            required
          />
        </div>

        <label className="login-label" htmlFor="password">Mot de passe</label>
        <div className="login-field">
          <Lock size={18} />
          <input
            id="password"
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPwd(!showPwd)}
            title={showPwd ? 'Masquer' : 'Afficher'}
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {message && <div className="login-error">{message}</div>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? (<><Loader2 size={18} className="spin" /> Connexion...</>) : 'Se connecter'}
        </button>

        <p className="login-foot">Commune Urbaine de Fianarantsoa</p>
      </form>
    </div>
  );
}
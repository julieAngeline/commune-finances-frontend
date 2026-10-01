import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
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
      setMessage('Erreur : ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h1
  style={{
    fontSize: '2rem',
    lineHeight: 1.3,
    textAlign: 'center',
    margin: '0 0 24px 0',
    whiteSpace: 'nowrap',
  }}
>
  Connexion Odoo
</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Login / Email</label>
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)}
            placeholder="Votre login Odoo" required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe Odoo" required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}
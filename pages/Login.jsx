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
      const user = await doLogin(login, password);
      console.log('Utilisateur connecté à Odoo :', user);

      setMessage('Connexion réussie ! Bienvenue ' + user.name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setMessage('Erreur : ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '10px',
      }}
    >
      <h1>Connexion Odoo</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Login / Email</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Votre login Odoo"
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe Odoo"
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}
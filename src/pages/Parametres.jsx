import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { nomAffiche } from '../utils/format';

const box = {
  padding: 20, marginBottom: 16, maxWidth: 520,
  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
};

export default function Parametres() {
  const { user } = useAuth();

  return (
    <>
      <h2>Paramètres</h2>

      <div style={{ ...box, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 42, height: 42, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', color: 'var(--accent)', background: 'var(--accent-soft)',
          }}
        >
          <User size={20} />
        </div>
        <strong style={{ fontSize: '1.05rem' }}>{nomAffiche(user?.name)}</strong>
      </div>

      <div style={box}>
        <p style={{ margin: 0 }}>
          <strong>Commune Finances</strong><br />
          Commune Urbaine de Fianarantsoa
        </p>
      </div>
    </>
  );
}
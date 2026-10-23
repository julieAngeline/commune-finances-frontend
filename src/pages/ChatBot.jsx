import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Trash2, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { askAssistant } from '../api/chat';
import '../components/ui.css';

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  text:
    "Bonjour, je suis l'assistant de la Commune Urbaine de Fianarantsoa. " +
    'Je peux répondre aux questions sur les règles de gestion et sur les données financières.',
  sources: [],
  time: new Date().toISOString(),
};

const SUGGESTIONS = [
  'Quel est le fonds libre de 2026 ?',
  'Quelle est la date limite des dépenses en période complémentaire ?',
  'Quelles sont les règles sur le crédit ouvert ?',
  'Combien ai-je dépensé sur le compte 6021 ?',
];

const hhmm = (iso) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const load = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem('chat_messages'));
    return saved?.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
};

export default function ChatBot() {
  const [messages, setMessages] = useState(load);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const endRef = useRef(null);
  const areaRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  const send = async (raw) => {
    const q = (raw ?? text).trim();
    if (!q || loading) return;

    setMessages((m) => [
      ...m,
      { id: `u${Date.now()}`, role: 'user', text: q, time: new Date().toISOString() },
    ]);
    setText('');
    setLoading(true);

    try {
      const result = await askAssistant(q, conversationId);
      setConversationId(result.conversationId);
      setMessages((m) => [
        ...m,
        {
          id: `b${Date.now()}`,
          role: 'bot',
          text: result.answer || "Je n'ai pas trouvé de réponse.",
          sources: result.sources || [],
          error: result.isError,
          time: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: `e${Date.now()}`,
          role: 'bot',
          error: true,
          text: e.message,
          sources: [],
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => {
    if (!confirm('Effacer la conversation ?')) return;
    setMessages([WELCOME]);
    setConversationId(null);
    sessionStorage.removeItem('chat_messages');
  };

  const onlyWelcome = messages.length === 1;

  return (
    <div className="chat-page">
      <div className="page-head">
        <h2>Assistant IA</h2>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={clear} disabled={onlyWelcome}>
            <Trash2 size={16} /> Effacer
          </button>
        </div>
      </div>

      <div className="chat-card">
        <div className="chat-body">
          {messages.map((m) => (
            <div key={m.id} className={`chat-msg ${m.role}`}>
              <div className="chat-avatar">
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="chat-content">
                <div className={`chat-bubble${m.error ? ' error' : ''}`}>{m.text}</div>
                {m.sources?.length > 0 && (
                  <div className="chat-sources">
                    <BookOpen size={13} />
                    {m.sources.map((s, i) => (
                      <span key={i} className="chat-source">
                        {typeof s === 'string' ? s : s.source || 'document'}
                      </span>
                    ))}
                  </div>
                )}
                <div className="chat-meta">{hhmm(m.time)}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-msg bot">
              <div className="chat-avatar"><Bot size={16} /></div>
              <div className="chat-content">
                <div className="chat-bubble chat-typing">
                  <span /><span /><span />
                </div>
                <div className="chat-meta">L'assistant réfléchit...</div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {onlyWelcome && !loading && (
          <div className="chat-suggestions">
            <span className="chat-suggest-title">
              <Sparkles size={14} /> Exemples de questions
            </span>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chat-chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <textarea
            ref={areaRef}
            className="chat-input"
            rows={1}
            value={text}
            placeholder="Posez votre question... (Entrée pour envoyer, Maj+Entrée pour un retour)"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            disabled={loading}
          />
          <button
            className="btn btn-primary chat-send"
            onClick={() => send()}
            disabled={loading || !text.trim()}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
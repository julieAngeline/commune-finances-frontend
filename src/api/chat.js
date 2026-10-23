const TIMEOUT_MS = 5 * 60 * 1000;

async function callKw(model, method, args = [], kwargs = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch('/web/dataset/call_kw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: { model, method, args, kwargs },
        id: Date.now(),
      }),
      signal: ctrl.signal,
    });

    if (!res.ok) {
      throw new Error(`Odoo a répondu HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.error) {
      const msg = json.error.data?.message || json.error.message || 'Erreur Odoo';
      throw new Error(msg);
    }
    return json.result;
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('Délai dépassé. Réessayez avec une question plus courte.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export async function createConversation(titre = 'Nouvelle conversation') {
  return callKw('chatbot.conversation', 'create_conversation', [titre]);
}

export async function askAssistant(message, conversationId = null) {
  if (!message || !message.trim()) {
    throw new Error('Le message ne peut pas être vide.');
  }

  let convId = conversationId;
  if (!convId) {
    convId = await createConversation(message.trim().slice(0, 60));
  }

  const result = await callKw(
    'chatbot.conversation',
    'envoyer_message',
    [[convId], message],
  );

  if (!result || typeof result !== 'object') {
    throw new Error('Réponse invalide du serveur Odoo.');
  }

  return {
    answer: result.answer || '',
    sources: result.sources || [],
    isError: !!result.is_error,
    conversationId: result.conversation_id || convId,
  };
}

export async function getConversationHistory(conversationId) {
  const msgs = await callKw(
    'chatbot.message',
    'search_read',
    [[['conversation_id', '=', conversationId]]],
    { fields: ['role', 'content', 'create_date'], order: 'create_date asc' },
  );
  return (msgs || []).map(m => ({
    role: m.role,
    content: m.content,
    date: m.create_date,
  }));
}

export async function archiveConversation(conversationId) {
  return callKw('chatbot.conversation', 'action_archiver', [[conversationId]]);
}
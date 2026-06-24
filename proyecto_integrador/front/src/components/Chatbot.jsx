import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const SUGGESTIONS = ['¿Qué es la manzanilla?', 'Jengibre', 'Plantas para la tos'];

const DEMO_SCRIPT = [
  {
    user: 'Tengo tos y congestión, ¿qué plantas me recomiendas?',
    bot: `Para molestias respiratorias leves, suelen consultarse:

• Eucalipto (Eucalyptus globulus) — expectorante; vaporizaciones o infusiones suaves.
• Menta — alivia la garganta irritada en infusiones.
• Manzanilla — calmante y útil si la tos viene con malestar digestivo.

Esta información es educativa. Si la tos persiste más de una semana, hay fiebre o dificultad para respirar, consulta a un profesional de la salud.`,
  },
  {
    user: '¿Qué es la manzanilla y para qué sirve?',
    bot: `La manzanilla (Matricaria chamomilla) es una planta digestiva y calmante muy usada en infusiones.

Usos tradicionales:
• Calmar el estómago y la digestión.
• Relajación leve e insomnio ocasional.
• Aplicaciones tópicas suaves en piel irritada.

Precaución: evitar si hay alergia a plantas de la familia Asteraceae.

Puedes ver la ficha completa en la sección Plantas medicinales.`,
  },
  {
    user: 'Gracias, ¿el jengibre tiene contraindicaciones?',
    bot: `Sí. El jengibre (Zingiber officinale) es útil para náuseas y como antiinflamatorio natural, pero conviene tener en cuenta:

• Consultar al médico si tomas anticoagulantes.
• Usar con moderación en embarazo.
• Puede irritar el estómago en dosis altas.

¿Te gustaría que te indique otra planta del catálogo?`,
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function AuthGate({ onClose, returnTo }) {
  const navigate = useNavigate();

  function goAuth(mode) {
    onClose();
    const params = new URLSearchParams({
      from: 'chat',
      returnTo,
    });
    if (mode === 'register') params.set('mode', 'register');
    navigate(`/auth?${params.toString()}`);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f5f2ed] via-white to-[#e7e2d9]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2d5a27]/10 blur-3xl" />

      <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          🔒
        </span>
        <h2 className="font-serif text-2xl font-bold leading-snug text-[#2d5a27]">
          Accede para usar el asistente con IA
        </h2>
        <p className="mt-3 text-base leading-relaxed text-stone-600">
          Regístrate gratis o inicia sesión para consultar plantas medicinales con
          nuestro asistente inteligente (Gemini + catálogo).
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => goAuth('login')}
            className="rounded-full bg-[#2d5a27] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1e3e1a]"
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => goAuth('register')}
            className="rounded-full border border-[#c4a484] bg-white px-6 py-3 text-center text-sm font-semibold text-[#c4a484] transition hover:bg-[#faf5f0]"
          >
            Registrarme
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const { isAuthenticated, loading: authLoading, user, getAuthHeaders, logout } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const returnTo = location.pathname + location.search;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const listRef = useRef(null);
  const demoAbortRef = useRef(false);
  const demoStartedRef = useRef(false);
  const demoRunningRef = useRef(false);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (location.pathname === '/auth') {
      setOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (searchParams.get('chat') === 'open') {
      setOpen(true);
      searchParams.delete('chat');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  }

  async function typeInInput(text) {
    setInput('');
    for (let i = 1; i <= text.length; i += 1) {
      if (demoAbortRef.current) return;
      setInput(text.slice(0, i));
      await sleep(28);
    }
    await sleep(500);
  }

  async function playDemo() {
    if (!isAuthenticated || demoPlaying || loading || demoRunningRef.current) return;
    demoAbortRef.current = false;
    demoRunningRef.current = true;
    demoStartedRef.current = true;
    sessionStorage.setItem('vhealt-chat-demo', '1');
    setDemoPlaying(true);

    for (let i = 0; i < DEMO_SCRIPT.length; i += 1) {
      const step = DEMO_SCRIPT[i];
      if (demoAbortRef.current) break;

      if (i === 0 && messages.length === 0) {
        await typeInInput(step.user);
        if (demoAbortRef.current) break;
        setInput('');
      }

      setMessages((m) => [...m, { role: 'user', text: step.user }]);
      scrollToBottom();
      await sleep(700);
      if (demoAbortRef.current) break;

      setLoading(true);
      scrollToBottom();
      await sleep(1300);
      if (demoAbortRef.current) break;

      setLoading(false);
      setMessages((m) => [...m, { role: 'bot', text: step.bot }]);
      scrollToBottom();
      await sleep(i < DEMO_SCRIPT.length - 1 ? 1100 : 400);
    }

    setDemoPlaying(false);
    demoRunningRef.current = false;
  }

  function stopDemo() {
    demoAbortRef.current = true;
    demoRunningRef.current = false;
    setDemoPlaying(false);
    setLoading(false);
    setInput('');
  }

  useEffect(() => {
    return () => {
      demoAbortRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!open || !isAuthenticated || demoStartedRef.current || messages.length > 0) {
      return undefined;
    }

    const seen = sessionStorage.getItem('vhealt-chat-demo');
    if (seen) return undefined;

    let cancelled = false;
    (async () => {
      await sleep(2200);
      if (!cancelled && open && !demoRunningRef.current) playDemo();
    })();

    return () => {
      cancelled = true;
    };
  }, [open, messages.length, isAuthenticated]);

  async function send(text) {
    if (!isAuthenticated) return;
    const trimmed = String(text || '').trim();
    if (!trimmed || loading || demoPlaying) return;
    stopDemo();
    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);
    scrollToBottom();
    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      if (res.status === 401) {
        await logout();
        setMessages((m) => [
          ...m,
          {
            role: 'bot',
            text: 'Tu sesión expiró. Inicia sesión de nuevo para continuar.',
          },
        ]);
        return;
      }

      const reply =
        data.reply ||
        (data.success === false ? data.message : 'No pude generar una respuesta.');
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'No pude conectar con el servidor. Intenta de nuevo en un momento.' },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  const inputDisabled = loading || demoPlaying || !isAuthenticated;

  return (
    <>
      <button
        type="button"
        aria-label="Abrir asistente"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-[#2d5a27] text-3xl text-white shadow-lg transition hover:bg-[#1e3e1a] hover:scale-105"
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-28 right-8 z-[100] flex h-[min(82vh,680px)] w-[min(calc(100vw-2rem),560px)] flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl">
          <div className="shrink-0 border-b border-stone-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-serif text-xl font-bold tracking-tight text-[#2d5a27]">
                  Asistente V-HEALT
                </p>
                <p className="text-sm text-[#c4a484]">
                  {isAuthenticated
                    ? `Hola, ${user?.fullName?.split(' ')[0] || 'usuario'}`
                    : 'Plantas medicinales y bienestar'}
                </p>
              </div>
              {isAuthenticated && !hasConversation && (
                demoPlaying ? (
                  <button
                    type="button"
                    onClick={stopDemo}
                    className="shrink-0 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
                  >
                    Detener
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={playDemo}
                    className="shrink-0 rounded-full bg-[#c4a484] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#a88968]"
                  >
                    Ver ejemplo
                  </button>
                )
              )}
            </div>
          </div>

          {authLoading ? (
            <div className="flex flex-1 items-center justify-center bg-[#fafaf9]">
              <div className="flex items-center gap-2 text-stone-500">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2d5a27]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2d5a27] [animation-delay:150ms]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2d5a27] [animation-delay:300ms]" />
              </div>
            </div>
          ) : !isAuthenticated ? (
            <AuthGate onClose={() => setOpen(false)} returnTo={returnTo} />
          ) : !hasConversation ? (
            <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f5f2ed] via-white to-[#e7e2d9]" />
              <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2d5a27]/10 blur-3xl" />
              <div className="pointer-events-none absolute left-1/2 top-2/3 h-40 w-72 -translate-x-1/2 rounded-full bg-[#c4a484]/15 blur-3xl" />

              <h2 className="relative z-10 mb-10 max-w-sm text-center font-serif text-[1.65rem] font-bold leading-snug tracking-tight text-[#2d5a27] sm:text-3xl">
                Hola, soy tu asistente de plantas medicinales
              </h2>

              <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md">
                <div className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-4 py-2 shadow-md ring-1 ring-stone-100 transition focus-within:border-[#2d5a27]/40 focus-within:ring-[#2d5a27]/20">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg text-[#2d5a27]">
                    🌿
                  </span>
                  <input
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-gray-800 outline-none placeholder:text-stone-400"
                    placeholder="Escribe tu pregunta…"
                    value={input}
                    disabled={inputDisabled}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={inputDisabled || !input.trim()}
                    aria-label="Enviar"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d5a27] text-white transition hover:bg-[#1e3e1a] disabled:opacity-40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="relative z-10 mt-6 flex max-w-md flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={inputDisabled}
                    className="rounded-full border border-emerald-100/80 bg-white/80 px-4 py-2 text-sm text-[#2d5a27] shadow-sm backdrop-blur-sm transition hover:border-emerald-200 hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div
                ref={listRef}
                className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fafaf9] px-5 py-5 text-base leading-relaxed"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl px-5 py-4 ${
                      msg.role === 'user'
                        ? 'ml-10 bg-[#2d5a27] text-white'
                        : 'mr-8 border border-stone-100/80 bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
                {loading && (
                  <div className="mr-8 flex w-fit items-center gap-2 rounded-2xl border border-stone-100/80 bg-white px-5 py-4 shadow-sm">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2d5a27] [animation-delay:0ms]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2d5a27] [animation-delay:150ms]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2d5a27] [animation-delay:300ms]" />
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-stone-100 bg-white p-4">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 transition focus-within:border-[#2d5a27]/40 focus-within:bg-white">
                    <input
                      className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-stone-400"
                      placeholder="Escribe tu pregunta…"
                      value={input}
                      disabled={inputDisabled}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={inputDisabled || !input.trim()}
                      className="rounded-full bg-[#c4a484] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a88968] disabled:opacity-50"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      disabled={inputDisabled}
                      className="rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-sm text-[#2d5a27] transition hover:bg-emerald-100 disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

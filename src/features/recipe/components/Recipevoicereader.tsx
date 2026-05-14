/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

export interface RecipeIngredientDto {
  ingredientName?: string;
  ingredient?: { name: string };
  quantity?: string | number;
  unit?: string;
  importance?: "Essential" | "Important" | "Optional";
}

export interface RecipeDto {
  name: string;
  instructions: string;
  recipeIngredients: RecipeIngredientDto[];
}

interface RecipeVoiceReaderProps {
  recipe: RecipeDto;
}

type Phase = "ingredients" | "steps";
type Status = "idle" | "speaking" | "listening" | "paused" | "done";
type Keyword = "stop" | "continue" | "forward" | "back";

interface LogEntry {
  id: number;
  msg: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
  }
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

function parseSteps(instructions: string): string[] {
  if (!instructions) return [];
  const byLine = instructions
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (byLine.length > 1) return byLine;
  return instructions
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatIngredient(ing: RecipeIngredientDto): string {
  const parts: string[] = [];
  if (ing.quantity) parts.push(String(ing.quantity));
  if (ing.unit) parts.push(ing.unit);
  const name = ing.ingredientName ?? ing.ingredient?.name;
  if (name) parts.push(name);
  if (ing.importance && ing.importance !== "Essential") {
    parts.push(`(${ing.importance})`);
  }
  return parts.join(" ");
}

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────

const PHASE: Record<string, Phase> = {
  INGREDIENTS: "ingredients",
  STEPS: "steps",
};
const STATUS: Record<string, Status> = {
  IDLE: "idle",
  SPEAKING: "speaking",
  PAUSED: "paused",
  LISTENING: "listening",
  DONE: "done",
};
const KEYWORDS: Keyword[] = ["stop", "continue", "forward", "back"];
const POST_ITEM_PAUSE_MS = 1500;

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────

export default function RecipeVoiceReader({ recipe }: RecipeVoiceReaderProps) {
  const ingredients: RecipeIngredientDto[] = recipe?.recipeIngredients ?? [];
  const steps: string[] = parseSteps(recipe?.instructions ?? "");
  const recipeName: string = recipe?.name ?? "Recipe";

  // ── state ──
  const [status, setStatus] = useState<Status>(STATUS.IDLE);
  const [phase, setPhase] = useState<Phase>(PHASE.INGREDIENTS);
  const [index, setIndex] = useState<number>(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [voicesReady, setVoicesReady] = useState<boolean>(false);

  // ── refs ──
  const statusRef = useRef<Status>(STATUS.IDLE);
  const phaseRef = useRef<Phase>(PHASE.INGREDIENTS);
  const indexRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(false);
  // Stores the paused keyword handler so the keep-alive timer can restart it
  const pausedKeywordHandlerRef = useRef<((kw: Keyword) => void) | null>(null);
  // Debounce: tracks the last time a keyword was acted on
  const lastKeywordTimeRef = useRef<number>(0);
  // Generation counter: incremented on every readItem call so stale speak() onend callbacks are ignored
  const genRef = useRef<number>(0);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { indexRef.current = index; }, [index]);

  // ── voice loading ──
  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;
    const load = () => setVoicesReady(true);
    if (synth.getVoices().length) { setVoicesReady(true); return; }
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopEverything();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ──
  const addLog = (msg: string) =>
    setLog((prev) => [
      { id: Date.now() + Math.random(), msg },
      ...prev,
    ].slice(0, 6));

  const currentItems = useCallback(
    (ph: Phase): (RecipeIngredientDto | string)[] =>
      ph === PHASE.INGREDIENTS ? ingredients : steps,
    [ingredients, steps]
  );

  const labelFor = (ph: Phase, idx: number): { prefix: string; text: string } => {
    const items = ph === PHASE.INGREDIENTS ? ingredients : steps;
    const prefix =
      ph === PHASE.INGREDIENTS
        ? `Ingredient ${idx + 1} of ${items.length}`
        : `Step ${idx + 1} of ${items.length}`;
    const text =
      ph === PHASE.INGREDIENTS
        ? formatIngredient(items[idx] as RecipeIngredientDto)
        : (items[idx] as string);
    return { prefix, text };
  };

  // ── speech synthesis ──
  const speak = useCallback(
    (text: string, onEnd: (() => void) | null) => {
      const synth = synthRef.current;
      if (!synth) return;
      // Bump generation BEFORE cancel so the old utterance's onend sees a stale gen
      const myGen = ++genRef.current;
      synth.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.92;
      utt.pitch = 1;
      const voices = synth.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith("en") && v.localService) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utt.voice = preferred;
      utt.onend = () => {
        // Only fire if we are still the current generation and component is mounted
        if (isMountedRef.current && genRef.current === myGen) onEnd?.();
      };
      synth.speak(utt);
    },
    []
  );

  // ── speech recognition ──
  const startListening = useCallback((onKeyword: (kw: Keyword) => void) => {
    const SR = (window as any).SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    cancelRef.current?.();
    cancelRef.current = null;
    try { recognitionRef.current?.stop(); } catch (_) {}
    recognitionRef.current = null;

    let active = true;
    cancelRef.current = () => { active = false; };

    const listen = () => {
      if (!active || !isMountedRef.current) return;

      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      rec.continuous = false;

      rec.onresult = (e: any) => {
        if (!active) return;
        const transcripts: string[] = Array.from(e.results)
          .flatMap((r: any) => Array.from(r) as any[])
          .map((alt: any) => (alt as any).transcript.toLowerCase().trim());

        for (const kw of KEYWORDS) {
          if (transcripts.some((t) => t.includes(kw))) {
            active = false;
            cancelRef.current = null;
            onKeyword(kw);
            return;
          }
        }
      };

      rec.onerror = (e: any) => {
        if (!active) return;
        const delay = e.error === "no-speech" ? 100 : 400;
        setTimeout(() => listen(), delay);
      };

      rec.onend = () => {
        if (!active) return;
        setTimeout(() => listen(), 100);
      };

      recognitionRef.current = rec;
      try { rec.start(); } catch (_) {
        setTimeout(() => listen(), 300);
      }
    };

    listen();
  }, []);

  const stopListening = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    try { recognitionRef.current?.stop(); } catch (_) {}
    recognitionRef.current = null;
  }, []);

  // ── starts the paused keep-alive loop ──
  // Every 5 seconds while paused, restart startListening so it never goes dead.
  const startPausedKeepAlive = useCallback((handler: (kw: Keyword) => void) => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    const tick = () => {
      if (!isPausedRef.current || !isMountedRef.current) return;
      startListening(handler);
      pauseTimerRef.current = setTimeout(tick, 5000);
    };
    pauseTimerRef.current = setTimeout(tick, 5000);
  }, [startListening]);

  // ── core reader ──
  const readItem = useCallback(
    (ph: Phase, idx: number) => {
      const items = currentItems(ph);

      if (idx >= items.length) {
        if (ph === PHASE.INGREDIENTS && steps.length > 0) {
          setPhase(PHASE.STEPS);
          setIndex(0);
          setStatus(STATUS.SPEAKING);
          speak("Now let's go through the preparation steps.", () =>
            readItem(PHASE.STEPS, 0)
          );
        } else {
          setStatus(STATUS.DONE);
          speak("You've reached the end of the recipe. Enjoy your meal!", null);
          addLog("Reading complete");
        }
        return;
      }

      const { prefix, text } = labelFor(ph, idx);
      setStatus(STATUS.SPEAKING);
      setPhase(ph);
      setIndex(idx);

      // speak() bumps genRef internally; capture it right after the call so we can
      // detect if a subsequent forward/back has advanced the generation before our
      // async continuations (post-item timer, startListening) get to run.
      speak(`${prefix}. ${text}`, () => {
        if (!isMountedRef.current) return;
        // Snapshot the gen that speak() stamped — this is now in genRef.current
        // because speak() does ++genRef before synth.speak(). If another speak()
        // has fired since (via forward/back), genRef will have advanced and the
        // outer speak()'s onend guard already prevented us from getting here.
        const itemGen = genRef.current;

        pauseTimerRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          if (genRef.current !== itemGen) return;
          setStatus(STATUS.LISTENING);

          startListening((keyword) => {
            // ── debounce guard ──
            const now = Date.now();
            if (now - lastKeywordTimeRef.current < 1000) return;
            lastKeywordTimeRef.current = now;

            stopListening();
            addLog(`<img src='/src/assets/icons/listening.png' alt="Microphone" style={{ width: '20px', height: '20px', objectFit: 'contain',}} /> "${keyword}" detected`);

            switch (keyword) {
              case "stop": {
                synthRef.current?.cancel();
                if (pauseTimerRef.current) {
                  clearTimeout(pauseTimerRef.current);
                  pauseTimerRef.current = null;
                }
                isPausedRef.current = true;
                setStatus(STATUS.PAUSED);
                addLog('⏸ Paused — say "Continue" or press the button');

                const onPausedKeyword = (kw: Keyword) => {
                  // ── debounce guard ──
                  const now = Date.now();
                  if (now - lastKeywordTimeRef.current < 1000) return;
                  lastKeywordTimeRef.current = now;

                  if (kw === "continue") {
                    stopListening();
                    isPausedRef.current = false;
                    pausedKeywordHandlerRef.current = null;
                    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
                    addLog("▶ Continued by voice");
                    handleContinue(phaseRef.current, indexRef.current);
                  } else if (kw === "forward") {
                    stopListening();
                    isPausedRef.current = false;
                    pausedKeywordHandlerRef.current = null;
                    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
                    addLog("⏭ Skipped forward by voice");
                    const nextIdx = indexRef.current + 1;
                    const cur = phaseRef.current;
                    const curItems = cur === PHASE.INGREDIENTS ? ingredients : steps;
                    readItem(
                      nextIdx >= curItems.length && cur === PHASE.INGREDIENTS ? PHASE.STEPS : cur,
                      nextIdx >= curItems.length && cur === PHASE.INGREDIENTS ? 0 : nextIdx
                    );
                  } else if (kw === "back") {
                    stopListening();
                    isPausedRef.current = false;
                    pausedKeywordHandlerRef.current = null;
                    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
                    addLog("⏮ Went back by voice");
                    readItem(phaseRef.current, Math.max(0, indexRef.current - 1));
                  }
                  // another "stop" while paused — ignore
                };

                pausedKeywordHandlerRef.current = onPausedKeyword;
                startListening(onPausedKeyword);
                startPausedKeepAlive(onPausedKeyword); // ← keep restarting every 5s
                break;
              }

              case "continue":
                isPausedRef.current = false;
                pausedKeywordHandlerRef.current = null;
                handleContinue(ph, idx);
                break;

              case "forward": {
                isPausedRef.current = false;
                pausedKeywordHandlerRef.current = null;
                if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
                const nextIdx = indexRef.current + 1;
                const cur = phaseRef.current;
                if (nextIdx >= currentItems(cur).length) {
                  readItem(
                    cur === PHASE.INGREDIENTS ? PHASE.STEPS : cur,
                    cur === PHASE.INGREDIENTS ? 0 : nextIdx
                  );
                } else {
                  readItem(cur, nextIdx);
                }
                break;
              }

              case "back": {
                isPausedRef.current = false;
                pausedKeywordHandlerRef.current = null;
                if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
                const prevIdx = Math.max(0, indexRef.current - 1);
                readItem(phaseRef.current, prevIdx);
                break;
              }

              default:
                break;
            }
          });

          // Auto-advance after 5 seconds of silence (only if not paused)
          const autoAdvanceTimer = setTimeout(() => {
            if (pauseTimerRef.current !== autoAdvanceTimer) return;
            if (isPausedRef.current) return;
            stopListening();
            readItem(phaseRef.current, indexRef.current + 1);
          }, 5000);
          pauseTimerRef.current = autoAdvanceTimer;
        }, POST_ITEM_PAUSE_MS);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItems, speak, startListening, stopListening, startPausedKeepAlive, steps.length]
  );

  const handleContinue = useCallback(
    (ph?: Phase, idx?: number) => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      isPausedRef.current = false;
      pausedKeywordHandlerRef.current = null;
      stopListening();
      readItem(ph ?? phaseRef.current, idx ?? indexRef.current);
    },
    [readItem, stopListening]
  );

  // ── control handlers ──
  const handleStart = () => {
    if (!voicesReady) return;
    setLog([]);
    isPausedRef.current = false;
    pausedKeywordHandlerRef.current = null;
    setStatus(STATUS.SPEAKING);
    setPhase(PHASE.INGREDIENTS);
    setIndex(0);
    speak(`Let's make ${recipeName}. Starting with the ingredients.`, () =>
      readItem(PHASE.INGREDIENTS, 0)
    );
    addLog("▶ Started");
  };

  const handleStop = () => {
    synthRef.current?.cancel();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = null;
    stopListening();
    isPausedRef.current = true;
    setStatus(STATUS.PAUSED);
    addLog('⏸ Paused — say "Continue" or press the button');

    const onPausedKeyword = (kw: Keyword) => {
      // ── debounce guard ──
      const now = Date.now();
      if (now - lastKeywordTimeRef.current < 1000) return;
      lastKeywordTimeRef.current = now;

      if (kw === "continue") {
        stopListening();
        isPausedRef.current = false;
        pausedKeywordHandlerRef.current = null;
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        addLog("▶ Continued by voice");
        handleContinue(phaseRef.current, indexRef.current);
      } else if (kw === "forward") {
        stopListening();
        isPausedRef.current = false;
        pausedKeywordHandlerRef.current = null;
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        const nextIdx = indexRef.current + 1;
        const cur = phaseRef.current;
        const curItems = cur === PHASE.INGREDIENTS ? ingredients : steps;
        readItem(
          nextIdx >= curItems.length && cur === PHASE.INGREDIENTS ? PHASE.STEPS : cur,
          nextIdx >= curItems.length && cur === PHASE.INGREDIENTS ? 0 : nextIdx
        );
      } else if (kw === "back") {
        stopListening();
        isPausedRef.current = false;
        pausedKeywordHandlerRef.current = null;
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        readItem(phaseRef.current, Math.max(0, indexRef.current - 1));
      }
    };

    pausedKeywordHandlerRef.current = onPausedKeyword;
    startListening(onPausedKeyword);
    startPausedKeepAlive(onPausedKeyword); // ← keep restarting every 5s
  };

  const handleContinueBtn = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    stopListening();
    isPausedRef.current = false;
    pausedKeywordHandlerRef.current = null;
    addLog("▶ Continued");
    handleContinue(phase, index);
  };

  const handleForward = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    stopListening();
    synthRef.current?.cancel();
    isPausedRef.current = false;
    pausedKeywordHandlerRef.current = null;
    const items = currentItems(phase);
    const next = index + 1;
    addLog("⏭ Skipped forward");
    if (next >= items.length && phase === PHASE.INGREDIENTS && steps.length) {
      setPhase(PHASE.STEPS);
      readItem(PHASE.STEPS, 0);
    } else {
      readItem(phase, next);
    }
  };

  const handleBack = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    stopListening();
    synthRef.current?.cancel();
    isPausedRef.current = false;
    pausedKeywordHandlerRef.current = null;
    const prev = Math.max(0, index - 1);
    addLog("⏮ Went back");
    readItem(phase, prev);
  };

  const handleReset = () => {
    stopEverything();
    isPausedRef.current = false;
    pausedKeywordHandlerRef.current = null;
    setStatus(STATUS.IDLE);
    setPhase(PHASE.INGREDIENTS);
    setIndex(0);
    setLog([]);
  };

  function stopEverything() {
    synthRef.current?.cancel();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    stopListening();
  }

  // ── derived display ──
  const items = currentItems(phase);
  const isActive: boolean = [STATUS.SPEAKING, STATUS.LISTENING, STATUS.PAUSED].includes(status);
  const progressPct: number = items.length > 0 ? Math.round((index / items.length) * 100) : 0;
  const phaseLabel: string = phase === PHASE.INGREDIENTS ? "Ingredients" : "Preparation Steps";
  const itemText: string | null =
    status !== STATUS.IDLE && status !== STATUS.DONE && items[index]
      ? phase === PHASE.INGREDIENTS
        ? formatIngredient(items[index] as RecipeIngredientDto)
        : (items[index] as string)
      : null;

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.micIcon}><img src='/src/assets/icons/listening.png' alt="Microphone" style={{ width: '40px', height: '40px', objectFit: 'contain'}} /></span>
        <div>
          <div style={styles.title}>Voice Recipe Reader</div>
          <div style={styles.subtitle}>{recipeName}</div>
        </div>
      </div>

      <div style={{ ...styles.badge, ...badgeStyle(status) }}>
        {statusIcon(status)} {statusLabel(status)}
      </div>

      {isActive && itemText && (
        <div style={styles.currentItem}>
          <div style={styles.phaseTag}>{phaseLabel}</div>
          <div style={styles.itemIndex}>
            {phase === PHASE.INGREDIENTS ? "Ingredient" : "Step"} {index + 1} / {items.length}
          </div>
          <div style={styles.itemText}>{itemText}</div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {status === STATUS.DONE && (
        <div style={{ ...styles.doneMsg, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
          <img src='/src/assets/icons/meta-servings.png' alt="Checkmark" style={{ width: '20px', height: '20px', objectFit: 'contain'}} /> Recipe complete — enjoy your meal!</div>
      )}

      <div style={styles.controls}>
        {status === STATUS.IDLE && (
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={handleStart}
            disabled={!voicesReady || (ingredients.length === 0 && steps.length === 0)}
          >
            ▶ Start Reading
          </button>
        )}

        {isActive && (
          <>
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={handleBack}>
              ⏮ Back
            </button>
            {status === STATUS.PAUSED ? (
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleContinueBtn}>
                ▶ Continue
              </button>
            ) : (
              <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleStop}>
                ⏸ Stop
              </button>
            )}
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={handleForward}>
              ⏭ Forward
            </button>
          </>
        )}

        {(isActive || status === STATUS.DONE) && (
          <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={handleReset}>
            ↺ Reset
          </button>
        )}
      </div>

      {status === STATUS.LISTENING && (
        <div style={styles.hint}>
          Say <b>Stop</b>, <b>Forward</b>, or <b>Back</b>
        </div>
      )}

      {status === STATUS.PAUSED && (
        <div style={{ ...styles.hint, ...styles.hintPaused }}>
          Say <b>Continue</b>, <b>Forward</b>, or <b>Back</b> — or use the buttons above
        </div>
      )}

      {log.length > 0 && (
        <div style={styles.log}>
          {log.map((entry) => (
            <div key={entry.id} style={styles.logItem}>{entry.msg}</div>
          ))}
        </div>
      )}

      {!(window as any).SpeechRecognition && !window.webkitSpeechRecognition && (
        <div style={styles.warning}>
          ⚠ Voice commands require Chrome or Edge. Speech playback works in all browsers.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Status helpers
// ─────────────────────────────────────────────
function statusLabel(s: Status): string {
  const map: Record<Status, string> = {
    idle: "Ready", speaking: "Speaking…", listening: "Listening…",
    paused: "Paused", done: "Done",
  };
  return map[s] ?? s;
}

function statusIcon(s: Status): React.ReactNode {
  const map: Record<Status, React.ReactNode> = {
    idle: <img src='/src/assets/icons/circle.png' alt="Idle" style={{ width: '30px', height: '30px', objectFit: 'contain'}} />, speaking: <img src='/src/assets/icons/speaking.png' alt="Speaking" style={{ width: '30px', height: '30px', objectFit: 'contain'}} />, listening: <img src='/src/assets/icons/listening.png' alt="Listening" style={{ width: '30px', height: '30px', objectFit: 'contain'}} />, paused: <img src='/src/assets/icons/paused.png' alt="Paused" style={{ width: '30px', height: '30px', objectFit: 'contain'}} />, done: <img src='/src/assets/icons/done.png' alt="Done" style={{ width: '30px', height: '30px', objectFit: 'contain'}} />,
  };
  return map[s] ?? "";
}

function badgeStyle(s: Status): React.CSSProperties {
  const map: Record<Status, React.CSSProperties> = {
    idle:      { background: "#e5e7eb", color: "#374151" },
    speaking:  { background: "#dbeafe", color: "#1d4ed8" },
    listening: { background: "#dcfce7", color: "#15803d" },
    paused:    { background: "#fef9c3", color: "#854d0e" },
    done:      { background: "#d1fae5", color: "#065f46" },
  };
  return map[s] ?? {};
}

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  card: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: "24px 28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  header: { display: "flex", alignItems: "center", gap: 12 },
  micIcon: { fontSize: 32 },
  title: { fontWeight: 700, fontSize: 18, color: "#111827" },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 12px", borderRadius: 999,
    fontSize: 13, fontWeight: 600, alignSelf: "flex-start",
  },
  currentItem: {
    background: "#f9fafb", border: "1px solid #e5e7eb",
    borderRadius: 12, padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 6,
  },
  phaseTag: {
    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.08em", color: "#9ca3af",
  },
  itemIndex: { fontSize: 12, color: "#6b7280" },
  itemText: { fontSize: 16, color: "#111827", lineHeight: 1.5, fontWeight: 500 },
  progressTrack: { height: 4, background: "#e5e7eb", borderRadius: 999, marginTop: 8, overflow: "hidden" },
  progressFill: { height: "100%", background: "#3b82f6", borderRadius: 999, transition: "width 0.4s ease" },
  doneMsg: {
    textAlign: "center", fontSize: 15, color: "#065f46",
    background: "#d1fae5", borderRadius: 10, padding: "12px 16px", fontWeight: 600,
  },
  controls: { display: "flex", flexWrap: "wrap", gap: 8 },
  btn: { padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "opacity 0.15s" },
  btnPrimary: { background: "#3b82f6", color: "#fff" },
  btnDanger: { background: "#ef4444", color: "#fff" },
  btnSecondary: { background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" },
  btnGhost: { background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb" },
  hint: {
    fontSize: 13, color: "#15803d", background: "#f0fdf4",
    borderRadius: 8, padding: "8px 12px", border: "1px solid #bbf7d0", textAlign: "center",
  },
  hintPaused: {
    color: "#854d0e", background: "#fefce8", border: "1px solid #fde68a",
  },
  log: { display: "flex", flexDirection: "column", gap: 4 },
  logItem: { fontSize: 12, color: "#6b7280", padding: "3px 0", borderBottom: "1px solid #f3f4f6" },
  warning: {
    fontSize: 12, color: "#92400e", background: "#fffbeb",
    borderRadius: 8, padding: "8px 12px", border: "1px solid #fde68a",
  },
};
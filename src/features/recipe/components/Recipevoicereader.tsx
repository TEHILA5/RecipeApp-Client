/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from "react";
import './Recipevoicereader.css';

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

export default function RecipeVoiceReader({ recipe }: RecipeVoiceReaderProps) {
  const ingredients: RecipeIngredientDto[] = recipe?.recipeIngredients ?? [];
  const steps: string[] = parseSteps(recipe?.instructions ?? "");
  const recipeName: string = recipe?.name ?? "Recipe";

  const [status, setStatus] = useState<Status>(STATUS.IDLE);
  const [phase, setPhase] = useState<Phase>(PHASE.INGREDIENTS);
  const [index, setIndex] = useState<number>(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [voicesReady, setVoicesReady] = useState<boolean>(false);

  const statusRef = useRef<Status>(STATUS.IDLE);
  const phaseRef = useRef<Phase>(PHASE.INGREDIENTS);
  const indexRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(false);
  const pausedKeywordHandlerRef = useRef<((kw: Keyword) => void) | null>(null);
  const lastKeywordTimeRef = useRef<number>(0);
  const genRef = useRef<number>(0);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { indexRef.current = index; }, [index]);

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

  const speak = useCallback(
    (text: string, onEnd: (() => void) | null) => {
      const synth = synthRef.current;
      if (!synth) return;
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
        if (isMountedRef.current && genRef.current === myGen) onEnd?.();
      };
      synth.speak(utt);
    },
    []
  );

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

  const startPausedKeepAlive = useCallback((handler: (kw: Keyword) => void) => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    const tick = () => {
      if (!isPausedRef.current || !isMountedRef.current) return;
      startListening(handler);
      pauseTimerRef.current = setTimeout(tick, 5000);
    };
    pauseTimerRef.current = setTimeout(tick, 5000);
  }, [startListening]);

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

      speak(`${prefix}. ${text}`, () => {
        if (!isMountedRef.current) return;
        const itemGen = genRef.current;

        pauseTimerRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          if (genRef.current !== itemGen) return;
          setStatus(STATUS.LISTENING);

          startListening((keyword) => {
            const now = Date.now();
            if (now - lastKeywordTimeRef.current < 1000) return;
            lastKeywordTimeRef.current = now;

            stopListening();
            addLog(`"${keyword}" detected`);

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
                };

                pausedKeywordHandlerRef.current = onPausedKeyword;
                startListening(onPausedKeyword);
                startPausedKeepAlive(onPausedKeyword);
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
    startPausedKeepAlive(onPausedKeyword);
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

  return (
    <div className="rvr-card">
      <div className="rvr-header">
        <span className="rvr-mic-icon">
          <img src='/src/assets/icons/listening.png' alt="Microphone" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </span>
        <div>
          <div className="rvr-title">Voice Recipe Reader</div>
          <div className="rvr-subtitle">{recipeName}</div>
        </div>
      </div>

      <div className={`rvr-badge rvr-badge--${status}`}>
        {statusIcon(status)} {statusLabel(status)}
      </div>

      {isActive && itemText && (
        <div className="rvr-current-item">
          <div className="rvr-phase-tag">{phaseLabel}</div>
          <div className="rvr-item-index">
            {phase === PHASE.INGREDIENTS ? "Ingredient" : "Step"} {index + 1} / {items.length}
          </div>
          <div className="rvr-item-text">{itemText}</div>
          <div className="rvr-progress-track">
            <div className="rvr-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {status === STATUS.DONE && (
        <div className="rvr-done-msg">
          <img src='/src/assets/icons/meta-servings.png' alt="Checkmark" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
          Recipe complete — enjoy your meal!
        </div>
      )}

      <div className="rvr-controls">
        {status === STATUS.IDLE && (
          <button
            className="rvr-btn rvr-btn--primary"
            onClick={handleStart}
            disabled={!voicesReady || (ingredients.length === 0 && steps.length === 0)}
          >
            ▶ Start Reading
          </button>
        )}

        {isActive && (
          <>
            <button className="rvr-btn rvr-btn--secondary" onClick={handleBack}>⏮ Back</button>
            {status === STATUS.PAUSED ? (
              <button className="rvr-btn rvr-btn--primary" onClick={handleContinueBtn}>▶ Continue</button>
            ) : (
              <button className="rvr-btn rvr-btn--danger" onClick={handleStop}>⏸ Stop</button>
            )}
            <button className="rvr-btn rvr-btn--secondary" onClick={handleForward}>⏭ Forward</button>
          </>
        )}

        {(isActive || status === STATUS.DONE) && (
          <button className="rvr-btn rvr-btn--ghost" onClick={handleReset}>↺ Reset</button>
        )}
      </div>

      {status === STATUS.LISTENING && (
        <div className="rvr-hint">
          Say <b>Stop</b>, <b>Forward</b>, or <b>Back</b>
        </div>
      )}

      {status === STATUS.PAUSED && (
        <div className="rvr-hint rvr-hint--paused">
          Say <b>Continue</b>, <b>Forward</b>, or <b>Back</b> — or use the buttons above
        </div>
      )}

      {log.length > 0 && (
        <div className="rvr-log">
          {log.map((entry) => (
            <div key={entry.id} className="rvr-log-item">{entry.msg}</div>
          ))}
        </div>
      )}

      {!(window as any).SpeechRecognition && !window.webkitSpeechRecognition && (
        <div className="rvr-warning">
          ⚠ Voice commands require Chrome or Edge. Speech playback works in all browsers.
        </div>
      )}
    </div>
  );
}

function statusLabel(s: Status): string {
  const map: Record<Status, string> = {
    idle: "Ready", speaking: "Speaking…", listening: "Listening…",
    paused: "Paused", done: "Done",
  };
  return map[s] ?? s;
}

function statusIcon(s: Status): React.ReactNode {
  const map: Record<Status, React.ReactNode> = {
    idle:      <img src='/src/assets/icons/circle.png'    alt="Idle"      style={{ width: '30px', height: '30px', objectFit: 'contain' }} />,
    speaking:  <img src='/src/assets/icons/speaking.png'  alt="Speaking"  style={{ width: '30px', height: '30px', objectFit: 'contain' }} />,
    listening: <img src='/src/assets/icons/listening.png' alt="Listening" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />,
    paused:    <img src='/src/assets/icons/paused.png'    alt="Paused"    style={{ width: '30px', height: '30px', objectFit: 'contain' }} />,
    done:      <img src='/src/assets/icons/done.png'      alt="Done"      style={{ width: '30px', height: '30px', objectFit: 'contain' }} />,
  };
  return map[s] ?? "";
}
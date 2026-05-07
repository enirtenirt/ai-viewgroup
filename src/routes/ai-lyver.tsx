import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import viewLogo from "@/assets/view-logo.png";

export const Route = createFileRoute("/ai-lyver")({
  head: () => ({
    meta: [
      { title: "AI-en lyver | Xledger" },
      { name: "description", content: "AI-en din lyver til styret. Den vet det ikke selv. Hvorfor AI-analyser av konserntall feiler — og hvordan du fikser det." },
      { property: "og:title", content: "AI-en lyver — til styret. Den vet det ikke selv." },
      { property: "og:description", content: "Hvorfor AI-genererte styrebriefinger feiler i konsern, og hva som må ligge under." },
    ],
  }),
  component: AiLyverPage,
});

const serif = { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace" };

function useQueryParam(key: string) {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setV(new URLSearchParams(window.location.search).get(key));
  }, [key]);
  return v;
}

function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
      }}
    />
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero({ selskap }: { selskap: string | null }) {
  const lead = selskap ? `AI-en hos ${selskap} lyver til styret.` : "AI-en din lyver til styret.";
  const words = lead.split(" ");
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 text-center">
      <div className="max-w-5xl">
        <h1 style={serif} className="text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.18, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block pr-[0.28em]"
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 1.5 + words.length * 0.18, duration: 1.4 }}
          style={serif}
          className="mt-10 text-2xl italic text-white/70 md:text-3xl"
        >
          Den vet det ikke selv.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.3, 0.7] }}
        transition={{ delay: 3.5, duration: 4, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-white/50"
        style={mono}
      >
        ↓ scroll
      </motion.div>
    </section>
  );
}

/* ─────────────────────── SECTION 2 — GENERATION ─────────────────────── */
const TERMINAL_LINES = [
  "> Genererer Q1 styrebriefing...",
  "> Henter data fra 5 ERP-systemer...",
  "> Konsoliderer...",
  "> Analyse fullført. Konfidensnivå: 94%",
];

function Terminal({ active }: { active: boolean }) {
  const [shown, setShown] = useState<string[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < TERMINAL_LINES.length; i++) {
        const line = TERMINAL_LINES[i];
        for (let c = 1; c <= line.length; c++) {
          if (cancelled) return;
          setTyping(line.slice(0, c));
          await new Promise((r) => setTimeout(r, 22));
        }
        if (cancelled) return;
        setShown((s) => [...s, line]);
        setTyping("");
        await new Promise((r) => setTimeout(r, 350));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div
      style={mono}
      className="rounded-md border border-white/10 bg-black/60 p-5 text-[13px] leading-7 text-emerald-300/90 shadow-2xl backdrop-blur"
    >
      <div className="mb-3 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
      </div>
      {shown.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      {typing && (
        <div>
          {typing}
          <span className="ml-0.5 inline-block h-4 w-2 -mb-0.5 animate-pulse bg-emerald-300/90" />
        </div>
      )}
    </div>
  );
}

function MiniBars({ wobble = 0 }: { wobble?: number }) {
  const heights = [40, 62, 55, 78, 70, 88];
  return (
    <svg viewBox="0 0 220 80" className="w-full">
      {heights.map((h, i) => {
        const w = wobble ? (Math.sin((i + 1) * wobble * 9) * 24 * wobble) : 0;
        const hh = Math.max(6, h + w);
        return (
          <rect
            key={i}
            x={i * 36 + 6}
            y={80 - hh}
            width={26}
            height={hh}
            rx={2}
            fill={wobble > 0.5 ? "#dc2626" : "#86efac"}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

function MiniLine({ wobble = 0 }: { wobble?: number }) {
  const pts = [10, 22, 18, 30, 26, 40, 36, 52, 48, 60, 58];
  const path = pts
    .map((y, i) => {
      const x = i * 20 + 5;
      const w = wobble ? Math.sin(i * 1.7 + wobble * 12) * 18 * wobble : 0;
      return `${i === 0 ? "M" : "L"}${x},${70 - y - w}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 220 80" className="w-full">
      <path d={path} fill="none" stroke={wobble > 0.5 ? "#dc2626" : "#67e8f9"} strokeWidth={2.2} />
    </svg>
  );
}

function ReportCard({ wobble }: { wobble: number }) {
  // baseline numbers
  const seed = useRef(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      seed.current += 1;
      setTick((t) => t + 1);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const flicker = (base: number, range: number) => {
    const subtle = Math.sin(tick * 1.3 + base) * 0.15;
    const heavy = wobble * (Math.sin(tick * 2.1 + base * 7) * range);
    return base + subtle + heavy;
  };

  const omsetning = (847 + flicker(0, 60)).toFixed(0);
  const yoyRaw = 12.4 + (wobble > 0.2 ? Math.sin(tick * 2.7) * 18 * wobble - 6 * wobble : Math.sin(tick) * 0.05);
  const ebitda = (14.2 + (wobble > 0.3 ? Math.sin(tick * 1.9 + 2) * 9 * wobble - 3 * wobble : 0)).toFixed(1);
  const conf = Math.max(12, Math.round(94 - wobble * 55 + (wobble > 0.4 ? Math.sin(tick * 3) * 12 : 0)));

  const danger = wobble > 0.5;
  const confColor = conf > 80 ? "text-emerald-400" : conf > 55 ? "text-yellow-400" : "text-red-500";

  return (
    <motion.div
      animate={
        wobble > 0.2
          ? { x: [0, -wobble * 4, wobble * 4, 0], rotate: [0, -wobble * 0.3, wobble * 0.3, 0] }
          : { x: 0, rotate: 0 }
      }
      transition={{ duration: 0.18, repeat: wobble > 0.2 ? Infinity : 0 }}
      className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 shadow-2xl backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div style={mono} className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Q1 · Styrebriefing
          </div>
          <div style={serif} className="mt-1 text-2xl">Konsern · sammendrag</div>
        </div>
        <div className="text-right">
          <div style={mono} className="text-[10px] uppercase tracking-[0.25em] text-white/40">Konfidens</div>
          <div style={mono} className={`text-2xl font-semibold ${confColor}`}>{conf}%</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <div style={mono} className="text-[10px] uppercase tracking-[0.25em] text-white/40">Konsernomsetning</div>
          <div style={serif} className={`mt-2 text-3xl ${danger ? "text-red-400" : "text-white"}`}>
            NOK {omsetning}M
          </div>
          <div style={mono} className={`mt-1 text-xs ${yoyRaw < 0 ? "text-red-500" : "text-emerald-400"}`}>
            {yoyRaw >= 0 ? "+" : ""}{yoyRaw.toFixed(1)}% YoY
          </div>
          <div className="mt-3"><MiniBars wobble={wobble} /></div>
        </div>
        <div>
          <div style={mono} className="text-[10px] uppercase tracking-[0.25em] text-white/40">EBITDA-margin</div>
          <div style={serif} className={`mt-2 text-3xl ${danger ? "text-red-400" : "text-white"}`}>
            {ebitda}%
          </div>
          <div style={mono} className="mt-1 text-xs text-emerald-400">+180 bps</div>
          <div className="mt-3"><MiniLine wobble={wobble} /></div>
        </div>
        <div>
          <div style={mono} className="text-[10px] uppercase tracking-[0.25em] text-white/40">Regioner</div>
          <ul className="mt-2 space-y-2 text-sm">
            {["Norge", "Sverige", "Danmark"].map((r, i) => {
              const ok = wobble < 0.4 || (i + tick) % 3 !== 0;
              return (
                <li key={r} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-white/80">{r}</span>
                  <span style={mono} className={`text-xs ${ok ? "text-emerald-400" : "text-red-500"}`}>
                    {ok ? "Above plan" : "Below plan"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function GenerationAndWobble() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // wobble ramps up in the second half
  const wobble = useTransform(scrollYProgress, [0, 0.45, 0.7, 1], [0, 0, 0.4, 1]);
  const [w, setW] = useState(0);
  useEffect(() => wobble.on("change", setW), [wobble]);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { amount: 0.4, once: true });

  return (
    <section ref={ref} className="relative px-6 py-32">
      <div ref={inViewRef} className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={serif}
            className="text-4xl leading-tight md:text-5xl"
          >
            Den genererer briefingen<br />på under et minutt.
          </motion.h2>
          <p className="max-w-md text-white/60">
            Ett klikk. Fem ERP-systemer. Tall, grafer og en konfidensscore som ser overbevisende ut.
          </p>
          <Terminal active={inView} />
        </div>
        <div className="md:pt-24">
          <ReportCard wobble={w} />
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          style={serif}
          className="text-2xl italic text-white/70"
        >
          Så begynner tallene å bevege seg.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 4 — REVEAL ─────────────────────── */
function Reveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bg = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["#190523", "#3A0E0E", "#7A1B1B", "#7A1B1B"]);
  return (
    <motion.section
      ref={ref}
      style={{ backgroundColor: bg }}
      className="relative flex min-h-screen items-center justify-center px-6 text-center"
    >
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={serif}
          className="text-6xl leading-none md:text-8xl lg:text-9xl"
        >
          Alle tallene<br />var feil.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.85 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.8, duration: 1.4 }}
          style={serif}
          className="mt-10 text-2xl italic text-white/80 md:text-3xl"
        >
          AI-en visste det ikke. Styret heller ikke.
        </motion.p>
      </div>
    </motion.section>
  );
}

/* ─────────────────────── SECTION 5 — EXPLANATION ─────────────────────── */
const ERPS = [
  { name: "SAP", def: "Fakturert, ekskl. mva" },
  { name: "Visma", def: "Bokført inntekt" },
  { name: "Oracle", def: "Levert volum × pris" },
  { name: "Dynamics", def: "Inntektsført pr. kontrakt" },
  { name: "Custom ERP", def: "Sum salgsordre" },
];

function DefinitionDiagram() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div style={mono} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        01 · Definisjoner
      </div>
      <h3 style={serif} className="mt-2 text-3xl text-neutral-900">
        Fem systemer. Fem definisjoner av "omsetning".
      </h3>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-5">
        {ERPS.map((e, i) => (
          <motion.div
            key={e.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-700" style={mono}>
              {e.name.slice(0, 2)}
            </div>
            <div style={mono} className="mt-3 text-xs text-neutral-500">{e.name}</div>
            <div className="mt-2 rounded-md border border-dashed border-red-300 bg-red-50/60 px-2 py-1.5 text-[11px] text-red-700">
              "{e.def}"
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-sm text-neutral-500">
        AI-en summerer fem ulike størrelser og kaller det ett tall.
      </p>
    </div>
  );
}

function CurrencyDiagram() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div style={mono} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        02 · Valuta
      </div>
      <h3 style={serif} className="mt-2 text-3xl text-neutral-900">
        Konvertert på fem forskjellige tidspunkter.
      </h3>
      <div className="mt-10 space-y-4">
        {[
          { label: "System A · sanntid", x: "5%", w: "90%", color: "bg-neutral-900" },
          { label: "System B · daglig snitt", x: "15%", w: "70%", color: "bg-neutral-700" },
          { label: "System C · månedsslutt", x: "78%", w: "10%", color: "bg-red-500" },
          { label: "System D · kvartalsslutt", x: "92%", w: "6%", color: "bg-red-500" },
          { label: "System E · manuell", x: "60%", w: "8%", color: "bg-yellow-500" },
        ].map((r, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs text-neutral-500" style={mono}>
              <span>{r.label}</span>
            </div>
            <div className="relative mt-1 h-2 rounded-full bg-neutral-100">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: r.w }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.9 }}
                className={`absolute top-0 h-2 rounded-full ${r.color}`}
                style={{ left: r.x }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-neutral-500">
        Samme transaksjon, fem ulike NOK-verdier — alle "korrekte".
      </p>
    </div>
  );
}

function EliminationDiagram() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div style={mono} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        03 · Intercompany
      </div>
      <h3 style={serif} className="mt-2 text-3xl text-neutral-900">
        Manuell eliminering. Med hull.
      </h3>
      <div className="mt-10 grid grid-cols-6 gap-2">
        {Array.from({ length: 24 }).map((_, i) => {
          const gap = [3, 7, 11, 14, 18, 22].includes(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.025, duration: 0.4 }}
              className={`h-10 rounded ${gap ? "border-2 border-dashed border-red-400 bg-red-50" : "bg-neutral-900"}`}
            />
          );
        })}
      </div>
      <p className="mt-8 text-sm text-neutral-500">
        Internsalg som ikke er eliminert blir oppblåst omsetning. AI-en ser det ikke.
      </p>
    </div>
  );
}

function Explanation() {
  return (
    <section className="bg-white px-6 py-32 text-neutral-900">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={serif}
          className="text-4xl leading-tight md:text-6xl"
        >
          Hvorfor det skjer.
        </motion.h2>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600">
          Tre strukturelle problemer i dataene som ingen AI-modell kan tenke seg ut av.
        </p>

        <div className="mt-20 space-y-16">
          <DefinitionDiagram />
          <CurrencyDiagram />
          <EliminationDiagram />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 6 — BRIDGE ─────────────────────── */
function Bridge() {
  return (
    <section className="bg-white px-6 py-40 text-neutral-900">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={serif}
          className="text-4xl leading-tight md:text-6xl"
        >
          Feilen ligger i grunnlaget.<br />
          <span className="italic text-neutral-500">Ikke i tallene.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-neutral-600"
        >
          Du kan ikke bygge AI-analyse på toppen av fragmenterte ERP-systemer med ulike definisjoner,
          ulike valutakurser og manuell konsolidering. AI-ready starter ett lag lenger ned —
          i datamodellen.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 7 — SOLUTION ─────────────────────── */
const BULLETS = [
  { i: "◷", t: "Ett system. Hele konsernet.", d: "Alle selskaper, alle land, samme database." },
  { i: "≡", t: "Én kontoplan med arvestruktur.", d: "Lokal fleksibilitet, konsernkonsistens." },
  { i: "⇆", t: "Automatisk intercompany-eliminering.", d: "Ingen manuelle ark. Ingen hull." },
  { i: "¤", t: "Flervaluta i samme prosess.", d: "Konsistent omregning, sporbart, revisjonsklart." },
];

function Solution() {
  return (
    <section className="px-6 py-32 text-white" style={{ background: "linear-gradient(180deg, #190523 0%, #50145A 100%)" }}>
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={serif}
          className="max-w-3xl text-4xl leading-tight md:text-5xl"
        >
          Xledger for konsern.
          <br />
          <span className="italic" style={{ color: "#CC99FF" }}>Den felles datamodellen som må ligge under.</span>
        </motion.h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {BULLETS.map((b, i) => (
            <motion.div
              key={b.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18, duration: 0.9 }}
              className="border-t pt-6"
              style={{ borderColor: "#B978F5" }}
            >
              <div style={{ ...serif, color: "#DCBEFA" }} className="text-3xl">{b.i}</div>
              <div style={serif} className="mt-3 text-2xl">{b.t}</div>
              <p className="mt-2" style={{ color: "#DCBEFA" }}>{b.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 8 — CTA ─────────────────────── */
function CTA() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-6 text-center text-white"
      style={{ background: "radial-gradient(ellipse at top, #7742A8 0%, #50145A 45%, #190523 100%)" }}
    >
      <div className="max-w-3xl">
        <div className="flex items-center justify-center gap-3">
          <img src={viewLogo} alt="VIEW Group" className="h-10 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
          <span style={mono} className="text-[11px] uppercase tracking-[0.4em]" >
            <span style={{ color: "#CC99FF" }}>Xledger Platinum Partner 2026</span>
          </span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          style={serif}
          className="mt-8 text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
        >
          VIEW Group gir deg<br />
          <span className="italic font-normal" style={{ color: "#CC99FF" }}>én sannhet for hele konsernet.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mx-auto mt-8 max-w-xl text-lg"
          style={{ ...serif, color: "#DCBEFA" }}
        >
          Opplev løsningen selv. Book en 20 min uforpliktende demo.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.9 }}
          href="mailto:post@viewgroup.no?subject=Book%2020%20min%20demo%20-%20VIEW%20Group"
          className="mt-12 inline-flex items-center gap-3 rounded-full px-10 py-5 transition hover:opacity-90"
          style={{ ...serif, background: "#FFC832", color: "#190523", fontWeight: 600 }}
        >
          <span className="text-lg">Book 20 min demo</span>
          <span>→</span>
        </motion.a>
      </div>
    </section>
  );
}

/* ─────────────────────── PAGE ─────────────────────── */
function AiLyverPage() {
  const selskap = useQueryParam("selskap");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) {
          .snap-y > section { scroll-snap-align: start; }
          main.snap { scroll-snap-type: y mandatory; }
        }
      `}</style>
      <main className="snap-y relative bg-[#190523] text-white antialiased">
        <GrainOverlay />
        <Hero selskap={selskap} />
        <GenerationAndWobble />
        <Reveal />
        <Explanation />
        <Bridge />
        <Solution />
        <CTA />
      </main>
    </>
  );
}

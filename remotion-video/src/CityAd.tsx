import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { type CityConfig } from "./config/cityConfig";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const playfair = loadPlayfair("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const C = {
  bg: "#190523",
  mid: "#7742A8",
  lavender: "#CC99FF",
  lavLight: "#DCBEFA",
  yellow: "#FFC832",
  white: "#FFFFFF",
  dark: "#1E0830",
  cardBg: "#FFFFFF",
  kpiBg: "#F0E4FF",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fi = (frame: number, s: number, d = 20) =>
  interpolate(frame, [s, s + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const si = (frame: number, s: number, d = 20, dist = 14) =>
  interpolate(frame, [s, s + d], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ── Root composition (450 frames = 15 s) ─────────────────────────────────────
export const CityAd = (cfg: CityConfig) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: inter.fontFamily }}>
    <Series>
      <Series.Sequence durationInFrames={100}><SceneHero cfg={cfg} /></Series.Sequence>
      <Series.Sequence durationInFrames={90}><SceneBenefits cfg={cfg} /></Series.Sequence>
      <Series.Sequence durationInFrames={90}><SceneQuote cfg={cfg} /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><ScenePricing cfg={cfg} /></Series.Sequence>
      <Series.Sequence durationInFrames={75}><SceneCTA cfg={cfg} /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ── SCENE 1: HERO (100 frames) ────────────────────────────────────────────────
function SceneHero({ cfg }: { cfg: CityConfig }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = fi(frame, 0, 12);
  const cityOp = fi(frame, 10, 16);
  const cityY = si(frame, 10, 16, 10);

  const headSpring = spring({ frame: frame - 22, fps, config: { damping: 22, stiffness: 80 } });
  const tagOp = fi(frame, 54, 22);
  const tagY = si(frame, 54, 22, 10);
  const rulerW = interpolate(frame, [80, 96], [0, 936], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 40% 30%, #3D1250 0%, #250A38 50%, ${C.bg} 100%)`,
        opacity: bgOp,
      }}
    >
      {/* City eyebrow */}
      <div
        style={{
          position: "absolute",
          top: 88,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: cityOp,
          transform: `translateY(${cityY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 13,
            fontWeight: 600,
            color: C.lavender,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            border: `1px solid rgba(204,153,255,0.35)`,
            padding: "6px 18px",
            borderRadius: 100,
          }}
        >
          {cfg.city}
        </span>
      </div>

      {/* Main headline */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: "50%",
          transform: `translateY(calc(-54% + ${(1 - headSpring) * 32}px))`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: playfair.fontFamily,
            fontSize: 86,
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.08,
            margin: 0,
            opacity: headSpring,
          }}
        >
          Mer enn
          <br />
          bare regnskap.
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 22,
            fontWeight: 400,
            color: C.lavLight,
            margin: "32px 0 0",
            lineHeight: 1.5,
            opacity: tagOp,
            transform: `translateY(${tagY}px)`,
          }}
        >
          VIEW Group gir selskaper i {cfg.city} fastpris,
          <br />
          bedre innsikt og en partner som faktisk bidrar.
        </p>
      </div>

      {/* Sweeping rule at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 104,
          left: 72,
          height: 1,
          width: rulerW,
          background: `linear-gradient(to right, ${C.mid}, ${C.lavender})`,
        }}
      />
    </AbsoluteFill>
  );
}

// ── SCENE 2: BENEFITS (90 frames) ─────────────────────────────────────────────
function SceneBenefits({ cfg }: { cfg: CityConfig }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delays = [8, 28, 48] as const;
  const springs = delays.map((d) =>
    spring({ frame: frame - d, fps, config: { damping: 20, stiffness: 120 } })
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #2E0A44 0%, ${C.bg} 70%)`,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: 84,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: fi(frame, 4, 14),
        }}
      >
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 12,
            fontWeight: 600,
            color: C.lavender,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          Med VIEW Group får du
        </span>
      </div>

      {/* Benefit cards */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          marginTop: 20,
        }}
      >
        {cfg.benefits.map((benefit, i) => (
          <div
            key={i}
            style={{
              background: C.cardBg,
              borderRadius: 16,
              padding: "24px 28px",
              boxShadow: "0 6px 40px rgba(119,66,168,0.28)",
              opacity: springs[i],
              transform: `translateX(${(1 - springs[i]) * -56}px)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Left accent bar */}
            <div
              style={{
                width: 4,
                alignSelf: "stretch",
                borderRadius: 2,
                background: `linear-gradient(to bottom, ${C.lavender}, ${C.mid})`,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.dark,
                  lineHeight: 1.2,
                }}
              >
                {benefit}
              </div>
              <div
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 17,
                  color: "#7B5A9A",
                  marginTop: 4,
                }}
              >
                {cfg.benefitSubs[i]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ── SCENE 3: QUOTE (90 frames) ────────────────────────────────────────────────
function SceneQuote({ cfg }: { cfg: CityConfig }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 6, fps, config: { damping: 22, stiffness: 85 } });
  const quoteMarkOp = fi(frame, 10, 18);
  const quoteTextOp = fi(frame, 22, 24);
  const borderH = interpolate(frame, [46, 68], [0, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const authorOp = fi(frame, 54, 20);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #2C0A40 0%, ${C.bg} 70%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: "50%",
          transform: `translateY(calc(-50% + ${(1 - cardSpring) * 40}px))`,
        }}
      >
        {/* Decorative border that grows */}
        <div
          style={{
            position: "absolute",
            left: -32,
            top: 0,
            width: 3,
            height: borderH,
            background: `linear-gradient(to bottom, ${C.lavender}, transparent)`,
            borderRadius: 2,
          }}
        />

        {/* Quote mark */}
        <div
          style={{
            fontFamily: playfair.fontFamily,
            fontSize: 120,
            color: C.mid,
            lineHeight: 0.7,
            marginBottom: 16,
            opacity: quoteMarkOp,
          }}
        >
          "
        </div>

        {/* Quote text */}
        <p
          style={{
            fontFamily: playfair.fontFamily,
            fontSize: 34,
            fontWeight: 400,
            fontStyle: "italic",
            color: C.white,
            lineHeight: 1.55,
            margin: 0,
            opacity: quoteTextOp,
          }}
        >
          {cfg.quote}
        </p>

        {/* Attribution */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: authorOp,
          }}
        >
          <div
            style={{
              width: 28,
              height: 2,
              background: C.lavender,
              borderRadius: 1,
            }}
          />
          <span
            style={{
              fontFamily: inter.fontFamily,
              fontSize: 18,
              fontWeight: 600,
              color: C.lavender,
              letterSpacing: "0.04em",
            }}
          >
            {cfg.quoteAuthor}
            {cfg.quoteCompany ? `, ${cfg.quoteCompany}` : ""}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── SCENE 4: PRICING (95 frames) ──────────────────────────────────────────────
function ScenePricing({ cfg }: { cfg: CityConfig }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagOp = fi(frame, 6, 20);
  const tagY = si(frame, 6, 20, 10);
  const card1Spring = spring({ frame: frame - 24, fps, config: { damping: 20, stiffness: 110 } });
  const card2Spring = spring({ frame: frame - 38, fps, config: { damping: 20, stiffness: 110 } });
  const badgeSpring = spring({ frame: frame - 66, fps, config: { damping: 18, stiffness: 160 } });

  const PricingCard = ({
    label,
    price,
    unit,
    items,
    sp,
  }: {
    label: string;
    price: string;
    unit: string;
    items: string[];
    sp: number;
  }) => (
    <div
      style={{
        flex: 1,
        background: C.cardBg,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 8px 60px rgba(80,20,130,0.38)",
        opacity: sp,
        transform: `translateY(${(1 - sp) * 36}px)`,
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.mid}, #50145A)`,
          padding: "16px 24px",
        }}
      >
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 12,
            fontWeight: 700,
            color: C.lavender,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
          <span
            style={{
              fontFamily: inter.fontFamily,
              fontSize: 13,
              color: "#7B5A9A",
            }}
          >
            fra
          </span>
          <span
            style={{
              fontFamily: playfair.fontFamily,
              fontSize: 52,
              fontWeight: 700,
              color: C.dark,
              lineHeight: 1,
            }}
          >
            {price}
          </span>
          <span
            style={{
              fontFamily: inter.fontFamily,
              fontSize: 16,
              color: "#7B5A9A",
              fontWeight: 500,
            }}
          >
            {unit}
          </span>
        </div>

        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              fontFamily: inter.fontFamily,
              fontSize: 14,
              color: C.dark,
            }}
          >
            <span style={{ color: C.mid, fontWeight: 700 }}>✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #2E0A44 0%, ${C.bg} 65%)`,
      }}
    >
      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 72,
          right: 72,
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
        }}
      >
        <p
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 20,
            color: C.lavLight,
            margin: 0,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          VIEW Group gir selskaper i{" "}
          <span style={{ color: C.yellow, fontWeight: 700 }}>{cfg.city}</span>{" "}
          fastpris, bedre innsikt
          <br />
          og en partner som faktisk bidrar – ikke bare bokfører.
        </p>
      </div>

      {/* Price cards */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: "50%",
          transform: "translateY(-46%)",
          display: "flex",
          gap: 16,
        }}
      >
        <PricingCard
          label="Regnskap"
          price={cfg.priceRegnskap}
          unit="kr/mnd"
          items={[
            "Løpende bokføring og rapportering",
            "MVA-håndtering og skattemeldinger",
            "ERP og Dashboards",
            "Tilgang til våre eksperter",
          ]}
          sp={card1Spring}
        />
        <PricingCard
          label="Lønnskjøring"
          price={cfg.priceLohn}
          unit="kr/ansatt"
          items={[
            "Lønnskjøring og skattetrekk",
            "Rapportering til myndighetene",
            "A-melding / Skatt-AGA",
            "Portal for ansatte og ledere",
          ]}
          sp={card2Spring}
        />
      </div>

      {/* Fastpris badge */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: badgeSpring,
          transform: `scale(${0.8 + badgeSpring * 0.2})`,
        }}
      >
        <div
          style={{
            background: C.yellow,
            borderRadius: 100,
            padding: "10px 32px",
          }}
        >
          <span
            style={{
              fontFamily: inter.fontFamily,
              fontSize: 18,
              fontWeight: 700,
              color: C.bg,
              letterSpacing: "0.04em",
            }}
          >
            ✦ Alltid fastpris — ingen overraskelser
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── SCENE 5: CTA (75 frames) ──────────────────────────────────────────────────
function SceneCTA({ cfg }: { cfg: CityConfig }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = fi(frame, 0, 14);
  const logoSpring = spring({ frame: frame - 8, fps, config: { damping: 22, stiffness: 100 } });
  const cityOp = fi(frame, 22, 16);
  const headOp = fi(frame, 30, 20);
  const headY = si(frame, 30, 20, 12);
  const subOp = fi(frame, 46, 18);
  const btnSpring = spring({ frame: frame - 52, fps, config: { damping: 18, stiffness: 160 } });
  const rulerW = interpolate(frame, [18, 30], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle breathe on CTA button once it's in
  const breathe =
    btnSpring > 0.98
      ? 1 + 0.022 * Math.sin(((frame - 64) / 14) * Math.PI)
      : btnSpring;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, #7742A8 0%, #50145A 40%, ${C.bg} 100%)`,
        opacity: bgOp,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "0 72px",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoSpring,
          transform: `scale(${0.85 + logoSpring * 0.15})`,
          marginBottom: 28,
        }}
      >
        <Img
          src={staticFile("images/view-logo.png")}
          style={{ height: 56, filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Sweeping rule */}
      <div
        style={{
          width: rulerW,
          height: 1,
          background: `linear-gradient(to right, transparent, ${C.lavender}, transparent)`,
          marginBottom: 24,
        }}
      />

      {/* City */}
      <div style={{ opacity: cityOp, marginBottom: 20 }}>
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 13,
            fontWeight: 600,
            color: C.lavender,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          {cfg.city}
        </span>
      </div>

      {/* CTA headline */}
      <h2
        style={{
          fontFamily: playfair.fontFamily,
          fontSize: 54,
          fontWeight: 700,
          color: C.white,
          margin: "0 0 12px",
          lineHeight: 1.18,
          opacity: headOp,
          transform: `translateY(${headY}px)`,
        }}
      >
        Book en uforpliktende
        <br />
        prat med {cfg.contactName}
      </h2>

      <p
        style={{
          fontFamily: inter.fontFamily,
          fontSize: 20,
          color: C.lavLight,
          margin: "0 0 40px",
          opacity: subOp,
        }}
      >
        20 min · gratis · ingen forpliktelser
      </p>

      {/* CTA button */}
      <div
        style={{
          background: C.yellow,
          borderRadius: 999,
          padding: "18px 52px",
          opacity: btnSpring,
          transform: `scale(${breathe})`,
        }}
      >
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 24,
            fontWeight: 700,
            color: C.bg,
          }}
        >
          viewgroup.no →
        </span>
      </div>
    </AbsoluteFill>
  );
}

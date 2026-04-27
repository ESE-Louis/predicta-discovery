import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Predicta — Discover where AI can unlock new revenue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050d1a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(74,158,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(74,158,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#4a9eff",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            PREDICTA
          </div>
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "#1e293b",
              margin: "0 16px",
            }}
          />
          <div
            style={{
              fontSize: "14px",
              color: "#475569",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            AI Revenue Generation
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 400,
            color: "#f1f5f9",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          Discover where AI can{" "}
          <span style={{ color: "#4a9eff", fontStyle: "italic" }}>
            unlock new revenue.
          </span>
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "22px",
            color: "#64748b",
            lineHeight: 1.5,
            marginBottom: "48px",
            maxWidth: "680px",
          }}
        >
          12 adaptive questions. One personalised AI Revenue Opportunity Map.
          Free, in under 15 minutes.
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#4a9eff",
              color: "#050d1a",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "14px 28px",
              borderRadius: "8px",
            }}
          >
            Start Free Discovery →
          </div>
          <div style={{ fontSize: "16px", color: "#334155" }}>
            discoverai.predicta.au
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

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
          width: "1200px",
          height: "630px",
          background: "#050d1a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Brand label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#4a9eff",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            PREDICTA
          </div>
          <div
            style={{
              width: "1px",
              height: "16px",
              background: "#1e293b",
              margin: "0 16px",
            }}
          />
          <div
            style={{
              fontSize: "13px",
              color: "#475569",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            AI Revenue Generation
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: "62px",
            fontWeight: 400,
            color: "#f1f5f9",
            lineHeight: 1.1,
            marginBottom: "12px",
            fontFamily: "sans-serif",
            maxWidth: "900px",
          }}
        >
          Discover where AI can
        </div>
        <div
          style={{
            fontSize: "62px",
            fontWeight: 400,
            color: "#4a9eff",
            lineHeight: 1.1,
            marginBottom: "32px",
            fontFamily: "sans-serif",
            fontStyle: "italic",
          }}
        >
          unlock new revenue.
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "22px",
            color: "#64748b",
            lineHeight: 1.5,
            marginBottom: "48px",
            fontFamily: "sans-serif",
            maxWidth: "700px",
          }}
        >
          12 adaptive questions. One personalised AI Revenue Opportunity Map. Free, in under 15 minutes.
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "#4a9eff",
              color: "#050d1a",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "14px 28px",
              borderRadius: "8px",
              fontFamily: "sans-serif",
            }}
          >
            Start Free Discovery →
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#334155",
              fontFamily: "sans-serif",
            }}
          >
            discoverai.predicta.au
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

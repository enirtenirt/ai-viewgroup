import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// Scene 1: CFO/Excel — manual work
export const Scene1Excel = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleY = spring({ frame, fps, config: { damping: 18 } });
  const sheetOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  const rows = [
    ["Revenue", "12 453", "11 875", "13 964", "12 195", "14 356"],
    ["COGS", "-6 245", "-5 963", "-6 872", "-6 349", "-7 124"],
    ["Gross Profit", "6 208", "5 912", "7 092", "5 846", "7 232"],
    ["Opex", "-3 126", "-3 084", "-3 271", "-3 193", "-3 456"],
    ["EBITDA", "3 082", "2 828", "3 821", "2 653", "3 776"],
    ["Net Profit", "1 691", "1 522", "2 010", "1 280", "1 999"],
  ];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#0a1020,#111a30)", padding: 80 }}>
      <div style={{ transform: `translateY(${interpolate(titleY,[0,1],[-30,0])}px)`, opacity: titleY }}>
        <div style={{ fontSize: 22, color: "#7a8aa8", letterSpacing: 4, fontWeight: 600 }}>MANDAG MORGEN · Q2-RAPPORTERING</div>
        <div style={{ fontSize: 72, fontWeight: 800, marginTop: 12, lineHeight: 1.05 }}>Enda en uke i Excel.</div>
      </div>
      <div style={{
        marginTop: 60, background: "#0f1730", border: "1px solid #1f2a4a", borderRadius: 12,
        opacity: sheetOp, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", overflow: "hidden",
      }}>
        <div style={{ background: "#0b1226", padding: "14px 20px", fontSize: 18, color: "#8aa", borderBottom: "1px solid #1f2a4a" }}>
          Financials_Q2_v17_FINAL_endelig.xlsx
        </div>
        <div style={{ padding: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 24, color: "#cdd6f4" }}>
            <thead>
              <tr style={{ color: "#7a8aa8", textAlign: "right" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Account</th>
                {["Jan", "Feb", "Mar", "Apr", "Mai"].map((m) => (
                  <th key={m} style={{ padding: 8 }}>{m} 2024</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const rowOp = interpolate(frame, [25 + i * 4, 40 + i * 4], [0, 1], { extrapolateRight: "clamp" });
                return (
                  <tr key={i} style={{ opacity: rowOp, borderTop: "1px solid #1a2444" }}>
                    {r.map((c, j) => (
                      <td key={j} style={{ padding: 10, textAlign: j === 0 ? "left" : "right", fontWeight: j === 0 ? 600 : 400 }}>{c}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Sample documents are drawn in the browser so the demo ships no binary fixtures
// and every sample is an accepted upload type (JPEG, PNG, PDF).

export type SampleId = "photo-id" | "bank-statement" | "parcel-photo";

export interface SampleDef {
  id: SampleId;
  name: string;
  mimeType: string;
  /** Approximate size, used for seeded records before the file is generated. */
  approxBytes: number;
}

export const SAMPLES: Record<SampleId, SampleDef> = {
  "photo-id": { id: "photo-id", name: "photo-id-front.jpg", mimeType: "image/jpeg", approxBytes: 61_440 },
  "bank-statement": { id: "bank-statement", name: "bank-statement-aug.pdf", mimeType: "application/pdf", approxBytes: 2_048 },
  "parcel-photo": { id: "parcel-photo", name: "damaged-parcel.png", mimeType: "image/png", approxBytes: 88_064 },
};

export const TOUR_SAMPLE_IDS: SampleId[] = ["photo-id", "bank-statement", "parcel-photo"];

const cache = new Map<SampleId, Promise<File>>();

export function createSampleFile(id: SampleId): Promise<File> {
  let pending = cache.get(id);
  if (!pending) {
    pending = build(id);
    cache.set(id, pending);
  }
  return pending;
}

async function build(id: SampleId): Promise<File> {
  const def = SAMPLES[id];
  if (id === "bank-statement") {
    const bytes = makePdf([
      "Sample Bank current account",
      "Statement period: 1 Aug to 31 Aug",
      "Account: ACCT-784521",
      "",
      "02 Aug   Salary                 +2,450.00",
      "05 Aug   Rent                   -1,100.00",
      "11 Aug   Groceries                 -86.40",
      "19 Aug   Utilities                -142.18",
      "27 Aug   Transfer to savings      -300.00",
      "",
      "Closing balance                  1,648.92",
      "",
      "Sample document generated for the Attach demo.",
    ]);
    return new File([bytes], def.name, { type: def.mimeType });
  }

  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  if (id === "photo-id") drawIdCard(ctx);
  else drawParcel(ctx);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create sample"))), def.mimeType, 0.88),
  );
  return new File([blob], def.name, { type: def.mimeType });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawIdCard(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, 960, 600);
  bg.addColorStop(0, "#d9d4c7");
  bg.addColorStop(1, "#b9b2a3");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 960, 600);

  ctx.save();
  ctx.translate(480, 300);
  ctx.rotate(-0.04);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  const card = ctx.createLinearGradient(-330, -205, 330, 205);
  card.addColorStop(0, "#f4f1ff");
  card.addColorStop(1, "#dfe9f3");
  ctx.fillStyle = card;
  roundRect(ctx, -330, -205, 660, 410, 28);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(480, 300);
  ctx.rotate(-0.04);
  ctx.fillStyle = "#6b1f7a";
  roundRect(ctx, -330, -205, 660, 70, 28);
  ctx.fill();
  ctx.fillRect(-330, -165, 660, 30);
  ctx.fillStyle = "#fff";
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.fillText("IDENTITY CARD", -300, -158);

  ctx.fillStyle = "#c9c3d9";
  roundRect(ctx, -295, -110, 190, 240, 16);
  ctx.fill();
  ctx.fillStyle = "#8e86a6";
  ctx.beginPath();
  ctx.arc(-200, -30, 52, 0, Math.PI * 2);
  ctx.fill();
  roundRect(ctx, -275, 30, 150, 100, 60);
  ctx.fill();

  const rows: [string, string][] = [
    ["SURNAME", "SAMPLE"],
    ["GIVEN NAMES", "ALEX J"],
    ["DATE OF BIRTH", "14 MAR 1988"],
    ["DOCUMENT NO", "X4821 5602"],
  ];
  rows.forEach(([label, value], i) => {
    const y = -95 + i * 60;
    ctx.fillStyle = "#6b6485";
    ctx.font = "600 16px Inter, system-ui, sans-serif";
    ctx.fillText(label, -70, y);
    ctx.fillStyle = "#1e1a2e";
    ctx.font = "600 28px Inter, system-ui, sans-serif";
    ctx.fillText(value, -70, y + 30);
  });

  ctx.fillStyle = "rgba(107,31,122,0.15)";
  ctx.font = "700 64px Inter, system-ui, sans-serif";
  ctx.fillText("SPECIMEN", 20, 170);
  ctx.restore();
}

function drawParcel(ctx: CanvasRenderingContext2D) {
  const floor = ctx.createLinearGradient(0, 0, 0, 600);
  floor.addColorStop(0, "#e7e2da");
  floor.addColorStop(1, "#c8c0b3");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, 960, 600);

  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(480, 500, 300, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Box front, side and top
  ctx.fillStyle = "#c58b4c";
  ctx.beginPath();
  ctx.moveTo(250, 250);
  ctx.lineTo(560, 280);
  ctx.lineTo(560, 500);
  ctx.lineTo(250, 470);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#a8743c";
  ctx.beginPath();
  ctx.moveTo(560, 280);
  ctx.lineTo(730, 220);
  ctx.lineTo(730, 430);
  ctx.lineTo(560, 500);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d9a466";
  ctx.beginPath();
  ctx.moveTo(250, 250);
  ctx.lineTo(420, 190);
  ctx.lineTo(730, 220);
  ctx.lineTo(560, 280);
  ctx.closePath();
  ctx.fill();

  // Crushed corner
  ctx.fillStyle = "#8a5b2c";
  ctx.beginPath();
  ctx.moveTo(560, 280);
  ctx.lineTo(640, 250);
  ctx.lineTo(610, 330);
  ctx.lineTo(560, 360);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5e3c1a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(575, 300);
  ctx.lineTo(600, 318);
  ctx.lineTo(585, 340);
  ctx.stroke();

  // Tape and label
  ctx.fillStyle = "rgba(240,230,200,0.75)";
  ctx.beginPath();
  ctx.moveTo(330, 222);
  ctx.lineTo(390, 200);
  ctx.lineTo(700, 228);
  ctx.lineTo(640, 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fbfaf6";
  ctx.beginPath();
  ctx.moveTo(300, 320);
  ctx.lineTo(470, 336);
  ctx.lineTo(470, 430);
  ctx.lineTo(300, 414);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2b2b2b";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(316, 342 + i * 18 + i * 1.5, 120 - i * 18, 7);
  }

  ctx.fillStyle = "rgba(30,20,10,0.55)";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.fillText("Sample photo for the Attach demo", 28, 570);
}

/** Builds a single-page PDF with one line of Helvetica text per entry. */
function makePdf(lines: string[]): Uint8Array<ArrayBuffer> {
  const escape = (s: string) => s.replace(/[\\()]/g, (c) => `\\${c}`);
  const text = lines
    .map((line, i) => `BT /F1 ${i === 0 ? 18 : 12} Tf 56 ${780 - i * 24} Td (${escape(line)}) Tj ET`)
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
  ];

  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  out += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(out);
}

import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const DEMO_TOKEN = "demo-preview";
const DEMO_UPLOAD_ID = "UPLOAD-DEMO-001";
const DEMO_ACCOUNT_NUMBER = "DEMO-ACCT-2048";

app.use(cors());
app.use(express.json());

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/sessions/token/:token", (req, res) => {
  if (req.params.token !== DEMO_TOKEN) {
    return res.status(404).json({ error: "This public preview only supports the fixed demo upload link." });
  }

  return res.json({
    uploadId: DEMO_UPLOAD_ID,
    accountNumber: DEMO_ACCOUNT_NUMBER,
    status: "preview",
  });
});

app.post("/api/uploads/by-token/:token", upload.array("files"), (req, res) => {
  if (req.params.token !== DEMO_TOKEN) {
    return res.status(404).json({ error: "This public preview only supports the fixed demo upload link." });
  }

  const files = (req.files as Express.Multer.File[]) ?? [];

  return res.json({
    uploadId: DEMO_UPLOAD_ID,
    accountNumber: DEMO_ACCOUNT_NUMBER,
    uploadedAt: new Date().toISOString(),
    fileCount: files.length,
    files: files.map((file) => ({
      originalName: file.originalname,
      mimeType: file.mimetype,
    })),
  });
});

const PORT = 2002;
app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`));

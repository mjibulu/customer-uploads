import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface SuccessData {
  uploadId: string;
  accountNumber: string;
  uploadedAt: string;
  fileCount: number;
  files: { originalName: string; mimeType: string }[];
}

export default function UploadSuccessPage() {
  const [data, setData] = useState<SuccessData | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const raw = sessionStorage.getItem("upload_success");
    if (!raw) {
      setLocation("/");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      setLocation("/");
    }
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-2xl mx-auto px-6 h-13 flex items-center gap-2.5 py-3.5">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="font-semibold text-sm">Secure Document Upload</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-xl w-full space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-3 px-5 py-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">Upload Successful</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {data.fileCount} file{data.fileCount !== 1 ? "s" : ""} received
              </p>
            </div>
          </div>

          {/* Upload ID card - prominently displayed */}
          <Card>
            <CardContent className="pt-6 pb-6 text-center space-y-1">
              <p className="section-title">Your Upload ID</p>
              <p className="upload-id-hero">{data.uploadId}</p>
            </CardContent>
          </Card>

          {/* Advisor prompt */}
          <div className="flex gap-3 px-4 py-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Please read your Upload ID to your advisor</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                If you are still on the call, read out the Upload ID shown above so your advisor can locate your file.
              </p>
            </div>
          </div>

          {/* Summary card */}
          <Card>
            <CardContent className="pt-5 pb-5">
              <dl className="divide-y">
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm text-muted-foreground">Account Number</dt>
                  <dd className="font-mono font-medium text-sm">{data.accountNumber}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm text-muted-foreground">Upload Time</dt>
                  <dd className="text-sm">{new Date(data.uploadedAt).toLocaleString()}</dd>
                </div>
                <div className="py-2.5">
                  <dt className="text-sm text-muted-foreground mb-2">Files Uploaded</dt>
                  <dd className="space-y-1.5">
                    {data.files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="font-medium truncate">{f.originalName}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

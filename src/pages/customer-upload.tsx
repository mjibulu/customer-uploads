import { useLocation, useParams } from "wouter";
import { DemoBar } from "@/components/demo-bar";
import { CustomerHeader, CustomerUpload } from "@/features/customer-upload";

export default function CustomerUploadPage() {
  const { token = "" } = useParams<{ token: string }>();
  const [, navigate] = useLocation();

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <DemoBar />
      <CustomerHeader />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-xl">
          <CustomerUpload token={token} onUploaded={(s) => navigate(`/upload/success?id=${s.uploadId}`)} />
        </div>
      </main>
    </div>
  );
}

import { File, FileImage, FileText, FileVideo } from "lucide-react";
import { fileKind } from "@/lib/files";

export function FileIcon({ mimeType, className = "h-4 w-4" }: { mimeType: string; className?: string }) {
  switch (fileKind(mimeType)) {
    case "image":
      return <FileImage className={`${className} text-info`} aria-hidden />;
    case "pdf":
      return <FileText className={`${className} text-destructive`} aria-hidden />;
    case "video":
      return <FileVideo className={`${className} text-primary`} aria-hidden />;
    default:
      return <File className={`${className} text-muted-foreground`} aria-hidden />;
  }
}

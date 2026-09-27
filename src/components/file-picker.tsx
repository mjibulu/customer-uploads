import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/file-icon";
import { ACCEPT_ATTRIBUTE, MAX_FILES, formatFileSize, plural, validateSelection } from "@/lib/files";
import { createSampleFile, type SampleId } from "@/demo/samples";
import type { UploadInput } from "@/demo/store";

export interface PickedFile extends UploadInput {
  key: string;
}

interface FilePickerProps {
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
  onProblems: (message: string | null) => void;
  disabled?: boolean;
  /** Samples offered for visitors who have no files to hand. */
  sampleIds?: SampleId[];
  compact?: boolean;
}

let keySeed = 0;

export function FilePicker({ files, onChange, onProblems, disabled, sampleIds, compact }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);

  function add(incoming: UploadInput[]) {
    const { accepted, problems } = validateSelection(
      incoming.map((i) => i.file),
      files.length,
    );
    const next = incoming
      .filter((i) => accepted.includes(i.file))
      .map((i) => ({ ...i, key: `f${++keySeed}` }));
    onProblems(problems.length ? problems.join(". ") : null);
    if (next.length) onChange([...files, ...next]);
  }

  function addFileList(list: FileList | null) {
    if (!list) return;
    add(Array.from(list, (file) => ({ file })));
  }

  async function addSamples() {
    if (!sampleIds) return;
    setLoadingSamples(true);
    try {
      const present = new Set(files.map((f) => f.sampleId));
      const missing = sampleIds.filter((id) => !present.has(id));
      const generated = await Promise.all(missing.map(async (id) => ({ file: await createSampleFile(id), sampleId: id })));
      add(generated);
    } catch {
      onProblems("Could not create the sample files. Choose files from your device instead.");
    } finally {
      setLoadingSamples(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Choose files to upload"
        className={`dropzone${dragOver ? " drag-over" : ""}${compact ? " !py-6" : ""}${disabled ? " pointer-events-none opacity-60" : ""}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFileList(e.dataTransfer.files);
        }}
      >
        <CloudUpload className="mx-auto mb-2 h-8 w-8 text-primary/70" aria-hidden />
        <p className="text-sm font-medium">{dragOver ? "Drop files here" : "Drag files here, or tap to browse"}</p>
        <p className="mt-1 text-xs text-muted-foreground">Images, PDFs and videos. Up to {MAX_FILES} files, 100 MB each.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={(e) => {
          addFileList(e.target.files);
          e.target.value = "";
        }}
      />

      {sampleIds && files.length === 0 && (
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={addSamples} disabled={disabled || loadingSamples}>
          {loadingSamples ? "Preparing samples…" : "Use sample files"}
        </Button>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="section-title !mb-1">{plural(files.length, "file")} selected</p>
          <AnimatePresence initial={false}>
            {files.map((f) => (
              <motion.div
                key={f.key}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="file-item"
              >
                <span className="file-item-icon">
                  <FileIcon mimeType={f.file.type} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{f.file.name}</span>
                  <span className="block text-xs text-muted-foreground">{formatFileSize(f.file.size)}</span>
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(files.filter((x) => x.key !== f.key))}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

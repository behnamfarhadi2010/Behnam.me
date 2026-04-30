import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function imageSrc(objectPath: string | null | undefined): string | undefined {
  if (!objectPath) return undefined;
  if (/^https?:\/\//i.test(objectPath)) return objectPath;
  return `${basePath}/api/storage${objectPath}`;
}

export async function uploadImage(file: File): Promise<string> {
  const reqRes = await fetch(`${basePath}/api/storage/uploads/request-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type,
    }),
  });
  if (!reqRes.ok) throw new Error(`Upload URL request failed (${reqRes.status})`);
  const { uploadURL, objectPath } = (await reqRes.json()) as {
    uploadURL: string;
    objectPath: string;
  };
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error(`Upload to storage failed (${putRes.status})`);
  return objectPath;
}

interface Props {
  value: string | null | undefined;
  onChange: (path: string | null) => void;
  label?: string;
  shape?: "rect" | "circle";
}

export function ImageUploadField({ value, onChange, label = "Cover image", shape = "rect" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large (max 10 MB)");
      return;
    }
    setBusy(true);
    try {
      const path = await uploadImage(file);
      onChange(path);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(`Upload failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const src = imageSrc(value);
  const isCircle = shape === "circle";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <div className="flex items-start gap-4">
        {src ? (
          <div
            className={`relative overflow-hidden border border-[hsl(40,20%,82%)] bg-[hsl(40,20%,94%)] ${
              isCircle ? "h-24 w-24 rounded-full" : "h-28 w-44 rounded-md"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-1 right-1 rounded-full bg-black/60 hover:bg-black/80 text-white p-1"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div
            className={`flex items-center justify-center border-2 border-dashed border-[hsl(40,20%,80%)] bg-[hsl(40,20%,96%)] text-muted-foreground ${
              isCircle ? "h-24 w-24 rounded-full" : "h-28 w-44 rounded-md"
            }`}
          >
            <ImagePlus className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md border border-[hsl(40,20%,82%)] bg-background hover:bg-[hsl(40,20%,96%)] disabled:opacity-50 px-3 py-2 text-sm font-medium transition-colors"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {value ? "Replace" : "Upload"} image
          </button>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF, or WEBP. Up to 10 MB.</p>
        </div>
      </div>
    </div>
  );
}

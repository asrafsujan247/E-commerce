import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { notifyError } from "@utils/toast";

interface UploaderProps {
  setImageUrl: (url: string | string[]) => void;
  imageUrl?: string | string[];
  multiple?: boolean;
}

const Uploader = ({ setImageUrl, imageUrl, multiple }: UploaderProps) => {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const uploadUrl = import.meta.env.VITE_CLOUDINARY_URL as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    multiple: multiple ?? false,
    maxSize: 1_000_000,
    onDrop: (accepted) => {
      setFiles(
        accepted.map((f) => Object.assign(f, { preview: URL.createObjectURL(f) }))
      );
    },
  });

  useEffect(() => {
    if (!files.length || !uploadUrl || !uploadPreset) return;

    const upload = async () => {
      try {
        const urls: string[] = [];
        for (const file of files) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("upload_preset", uploadPreset);
          const res = await fetch(uploadUrl, { method: "POST", body: fd });
          const data = await res.json() as { secure_url?: string };
          if (data.secure_url) urls.push(data.secure_url);
        }
        setImageUrl(multiple ? urls : (urls[0] ?? ""));
      } catch {
        notifyError("Image upload failed");
      }
    };

    void upload();
  }, [files, uploadUrl, uploadPreset, multiple, setImageUrl]);

  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.preview)), [files]);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors text-center"
    >
      <input {...getInputProps()} />
      <FiUploadCloud className="mx-auto w-10 h-10 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">
        Drag &amp; drop or <span className="text-primary font-medium">browse</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 1MB</p>
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {files.map((f) => (
            <img key={f.name} src={f.preview} alt={f.name} className="w-16 h-16 object-cover rounded" />
          ))}
        </div>
      )}
      {imageUrl && !files.length && (
        <div className="mt-4">
          {Array.isArray(imageUrl)
            ? imageUrl.map((u, i) => <img key={i} src={u} alt="uploaded" className="w-16 h-16 object-cover rounded inline-block mr-2" />)
            : <img src={imageUrl} alt="uploaded" className="w-16 h-16 object-cover rounded mx-auto" />
          }
        </div>
      )}
    </div>
  );
};

export default Uploader;

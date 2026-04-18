"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { validateFileType, validateMagicBytes } from "@/lib/fileValidation";

interface Props {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ label, files, onChange, maxFiles = 5 }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      for (const file of acceptedFiles) {
        const typeCheck = validateFileType(file);
        if (!typeCheck.valid) {
          newErrors.push(typeCheck.error!);
          continue;
        }
        const magicCheck = await validateMagicBytes(file);
        if (!magicCheck.valid) {
          newErrors.push(magicCheck.error!);
          continue;
        }
        validFiles.push(file);
      }

      const combined = [...files, ...validFiles];
      if (combined.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} images allowed.`);
        const allowed = validFiles.slice(0, maxFiles - files.length);
        onChange([...files, ...allowed]);
      } else {
        onChange(combined);
      }
      setErrors(newErrors);
    },
    [files, onChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/jpg": [], "image/png": [], "image/webp": [] },
    maxFiles,
    multiple: true,
  });

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white/80">{label}</label>

      <div
        {...getRootProps()}
        className={`drop-zone p-4 md:p-6 text-center transition-all ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center mb-1">
            <svg className="w-6 h-6 text-[#f5c518]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-[#f5c518] font-medium text-sm">Drop your screenshots here</p>
          ) : (
            <>
              <p className="text-white/70 text-sm">
                <span className="text-[#f5c518] font-semibold">Click to upload</span> or drag & drop
              </p>
              <p className="text-white/30 text-xs">JPG, PNG, WEBP · Max 10MB each · Up to {maxFiles} images</p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-1"
          >
            {errors.map((err, i) => (
              <p key={i} className="text-red-400 text-xs flex items-center gap-1">
                <span>⚠</span> {err}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <div className="image-preview-grid">
          <AnimatePresence>
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group rounded-xl overflow-hidden aspect-square bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white text-xs font-bold hover:bg-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-white text-[10px] truncate">{file.name}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <p className="text-white/30 text-xs">
        {files.length}/{maxFiles} images uploaded
      </p>
    </div>
  );
}

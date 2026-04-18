const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_SECTION = 5;

const MAGIC_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  "image/jpg": [[0xff, 0xd8, 0xff]],
};

export function validateFileType(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `${file.name}: Only JPG, PNG, and WEBP images are allowed.` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `${file.name}: File exceeds 10MB limit.` };
  }
  return { valid: true };
}

export async function validateMagicBytes(file: File): Promise<{ valid: boolean; error?: string }> {
  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const signatures = MAGIC_SIGNATURES[file.type];
    if (!signatures) return { valid: false, error: `${file.name}: Unsupported file type.` };
    const isValid = signatures.some((sig) => sig.every((byte, i) => bytes[i] === byte));
    if (!isValid) {
      return { valid: false, error: `${file.name}: File content does not match declared type.` };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: `${file.name}: Could not validate file.` };
  }
}

export function validateFileCount(files: File[], sectionName: string): { valid: boolean; error?: string } {
  if (files.length > MAX_FILES_PER_SECTION) {
    return { valid: false, error: `${sectionName}: Maximum ${MAX_FILES_PER_SECTION} images allowed.` };
  }
  return { valid: true };
}

export async function validateFiles(files: File[], sectionName: string): Promise<string[]> {
  const errors: string[] = [];
  const countCheck = validateFileCount(files, sectionName);
  if (!countCheck.valid && countCheck.error) errors.push(countCheck.error);
  for (const file of files) {
    const typeCheck = validateFileType(file);
    if (!typeCheck.valid && typeCheck.error) { errors.push(typeCheck.error); continue; }
    const magicCheck = await validateMagicBytes(file);
    if (!magicCheck.valid && magicCheck.error) errors.push(magicCheck.error);
  }
  return errors;
}

export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
    .slice(0, 100);
}

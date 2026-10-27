export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
};

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida o tamanho, tipo MIME e assinatura binária (magic bytes) da imagem.
 */
export async function validateProfileImage(file: File): Promise<ImageValidationResult> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Formato inválido. Envie apenas JPEG, PNG ou WebP.' };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.` };
  }

  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = Array.from(new Uint8Array(buffer));
    const expectedMagic = MAGIC_BYTES[file.type];

    const isValidMagic = expectedMagic?.some((magic) =>
      magic.every((byte, i) => bytes[i] === byte),
    );

    if (!isValidMagic) {
      return { valid: false, error: 'Arquivo corrompido.' };
    }
  } catch {
    return { valid: false, error: 'Erro ao processar o arquivo.' };
  }

  return { valid: true };
}

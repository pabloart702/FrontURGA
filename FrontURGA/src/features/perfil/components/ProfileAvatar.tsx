import type { ChangeEvent } from 'react';
import { Camera, Trash2, User as UserIcon } from 'lucide-react';
import { SecureImage } from '../../../components/SecureImage';

interface ProfileAvatarProps {
  fotoPerfil: string;
  nome: string;
  uploadingImage: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: () => Promise<void>;
}

export function ProfileAvatar({
  fotoPerfil,
  nome,
  uploadingImage,
  onUpload,
  onRemove,
}: ProfileAvatarProps) {
  const initial = nome ? (
    nome.charAt(0).toUpperCase()
  ) : (
    <UserIcon size={24} className="logo-icon" />
  );

  return (
    <div className="profile-picture-container">
      {fotoPerfil ? (
        <SecureImage
          src={`/uploads/profiles/${fotoPerfil}`}
          alt="Foto de Perfil"
          className="profile-picture"
          zoomable={true}
          fallback={<div className="usuario-avatar-placeholder">{initial}</div>}
        />
      ) : (
        <div className="usuario-avatar-placeholder">{initial}</div>
      )}

      <label className="upload-btn" title="Alterar foto">
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={uploadingImage}
          style={{ display: 'none' }}
          aria-label="Upload de foto de perfil"
        />
        <Camera size={14} />
      </label>

      {fotoPerfil && (
        <button
          type="button"
          className="remove-photo-btn"
          title="Remover foto"
          onClick={onRemove}
          disabled={uploadingImage}
          aria-label="Remover foto de perfil"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

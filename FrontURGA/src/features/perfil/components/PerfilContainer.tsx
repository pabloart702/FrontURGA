import { usePerfil } from '../hooks/usePerfil';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileForm } from './ProfileForm';
import './Perfil.css';

export function PerfilContainer() {
  const {
    formData,
    handleChange,
    loading,
    saving,
    uploadingImage,
    fotoPerfil,
    message,
    canEditPrivilegedFields,
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
  } = usePerfil();

  if (loading) {
    return (
      <div className="perfil-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#71717a', margin: 0 }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="perfil-card">
      <div className="perfil-header">
        <div className="header-title">
          <ProfileAvatar
            fotoPerfil={fotoPerfil}
            nome={formData.nome}
            uploadingImage={uploadingImage}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
          />
          <h2>Meu Perfil</h2>
        </div>
      </div>

      {message.text && (
        <div
          className={`message-banner ${message.type}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </div>
      )}

      <ProfileForm
        formData={formData}
        onChange={handleChange}
        canEditPrivilegedFields={canEditPrivilegedFields}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

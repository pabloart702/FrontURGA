import { usePerfil } from '../hooks/usePerfil';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileForm } from './ProfileForm';
import './Perfil.css';

export function PerfilContainer() {
  const {
    formData,
    handleChange,
    loadState,
    actionState,
    fotoPerfil,
    canEditPrivilegedFields,
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
  } = usePerfil();

  if (loadState.status === 'loading') {
    return (
      <div className="perfil-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#71717a', margin: 0 }}>Carregando...</p>
      </div>
    );
  }

  const isActionLoading = actionState.status === 'loading';
  const feedbackMessage =
    actionState.status === 'success'
      ? { type: 'success', text: actionState.data }
      : actionState.status === 'error'
        ? { type: 'error', text: actionState.message }
        : null;

  return (
    <div className="perfil-card">
      <div className="perfil-header">
        <div className="header-title">
          <ProfileAvatar
            fotoPerfil={fotoPerfil}
            nome={formData.nome}
            uploadingImage={isActionLoading}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
          />
          <h2>Meu Perfil</h2>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`message-banner ${feedbackMessage.type}`}
          role={feedbackMessage.type === 'error' ? 'alert' : 'status'}
        >
          {feedbackMessage.text}
        </div>
      )}

      <ProfileForm
        formData={formData}
        onChange={handleChange}
        canEditPrivilegedFields={canEditPrivilegedFields}
        saving={isActionLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

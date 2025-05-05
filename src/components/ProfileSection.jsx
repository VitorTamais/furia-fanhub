'use client'
import { useState } from 'react';
import Image from 'next/image';

const ProfileSection = ({ userData, user, updateUserData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [profileData, setProfileData] = useState({
    nickname: userData?.nickname || '',
    name: userData?.name || '',
    email: userData?.email || user?.email || '',
    birthdate: userData?.birthdate || '',
    location: userData?.location || '',
    bio: userData?.bio || '',
    socialLinks: userData?.socialLinks || {
      twitter: '',
      instagram: '',
      twitch: ''
    },
    preferences: userData?.preferences || {
      notifications: true,
      newsletter: false,
      publicProfile: true
    },
    avatar: userData?.avatar || '/default-avatar.png'
  });
  
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          ...profileData
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        updateUserData(data.user); 
        setSaveStatus({ type: 'success', message: 'Perfil atualizado com sucesso!' });
        
        setIsEditing(false);
      } else {
        setSaveStatus({ type: 'error', message: data.message || 'Erro ao salvar' });
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erro de conexão' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas imagens!');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter menos de 2MB');
      return;
    }

    setIsUploading(true);
  
  try {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error(`HTTP error! status: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();

    const updateResponse = await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        avatar: uploadData.filename
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`HTTP error! status: ${updateResponse.status}`);
    }

    const updateData = await updateResponse.json();
    
    updateUserData(updateData.user);
    setProfileData(prev => ({
      ...prev,
      avatar: updateData.user.avatar
    }));
    
    const updatedUser = { ...user, avatar: updateData.user.avatar };
    localStorage.setItem('user', JSON.stringify(updatedUser));

  } catch (error) {
    console.error('Erro completo:', error);
    alert('Erro ao atualizar a imagem: ' + error.message);
  } finally {
    setIsUploading(false);
  }
};

  const renderViewMode = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/30">
            <Image 
              src={profileData.avatar} 
              alt={profileData.nickname} 
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profileData.nickname}</h2>
            {profileData.name && <p className="text-gray-400">{profileData.name}</p>}
            <p className="text-sm text-gray-500">
  {profileData.email || "Email não disponível"}
</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Editar Perfil</span>
        </button>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Localização</p>
            <p className="text-white">{profileData.location || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Data de Nascimento</p>
            <p className="text-white">{profileData.birthdate || 'Não informado'}</p>
          </div>
        </div>
      </div>
      
      {profileData.bio && (
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-white font-medium mb-2">Sobre Mim</h3>
          <p className="text-white/80">{profileData.bio}</p>
        </div>
      )}
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Redes Sociais</h3>
        <div className="flex flex-wrap gap-3">
          {profileData.socialLinks.twitter && (
            <a href={`https://twitter.com/${profileData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white/80 flex items-center space-x-2 transition-colors">
              <span>@{profileData.socialLinks.twitter}</span>
            </a>
          )}
          {profileData.socialLinks.instagram && (
            <a href={`https://instagram.com/${profileData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white/80 flex items-center space-x-2 transition-colors">
              <span>@{profileData.socialLinks.instagram}</span>
            </a>
          )}
          {profileData.socialLinks.twitch && (
            <a href={`https://twitch.tv/${profileData.socialLinks.twitch}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white/80 flex items-center space-x-2 transition-colors">
              <span>@{profileData.socialLinks.twitch}</span>
            </a>
          )}
          {!profileData.socialLinks.twitter && !profileData.socialLinks.instagram && !profileData.socialLinks.twitch && (
            <p className="text-gray-400">Nenhuma rede social adicionada</p>
          )}
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Preferências</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${profileData.preferences.notifications ? 'bg-white' : 'bg-gray-600'}`}></div>
            <span className="text-white">Receber notificações</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${profileData.preferences.newsletter ? 'bg-white' : 'bg-gray-600'}`}></div>
            <span className="text-white">Inscrever-se na newsletter</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${profileData.preferences.publicProfile ? 'bg-white' : 'bg-gray-600'}`}></div>
            <span className="text-white">Perfil público</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderEditMode = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30">
              <Image 
                src={profileData.avatar} 
                alt={profileData.nickname} 
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
              <span className="text-white text-xs">Alterar</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
            </label>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-full">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="nickname"
              value={profileData.nickname}
              onChange={handleChange}
              placeholder="Seu nickname"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-transparent hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="seu-email@exemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              disabled
            />
            <p className="text-gray-500 text-xs mt-1">Email não pode ser alterado</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Localização</label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleChange}
              placeholder="Sua cidade/estado"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Data de Nascimento</label>
            <input
              type="date"
              name="birthdate"
              value={profileData.birthdate}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-2">Sobre Mim</h3>
        <textarea
          name="bio"
          value={profileData.bio}
          onChange={handleChange}
          placeholder="Conte um pouco sobre você..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 h-32"
        ></textarea>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Twitter</label>
            <div className="flex">
              <span className="bg-white/10 px-3 flex items-center rounded-l-lg text-gray-400">@</span>
              <input
                type="text"
                name="socialLinks.twitter"
                value={profileData.socialLinks.twitter}
                onChange={handleChange}
                placeholder="seu_usuario"
                className="flex-1 bg-white/5 border border-white/10 border-l-0 rounded-r-lg px-4 py-2 text-white placeholder-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Instagram</label>
            <div className="flex">
              <span className="bg-white/10 px-3 flex items-center rounded-l-lg text-gray-400">@</span>
              <input
                type="text"
                name="socialLinks.instagram"
                value={profileData.socialLinks.instagram}
                onChange={handleChange}
                placeholder="seu_usuario"
                className="flex-1 bg-white/5 border border-white/10 border-l-0 rounded-r-lg px-4 py-2 text-white placeholder-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Twitch</label>
            <div className="flex">
              <span className="bg-white/10 px-3 flex items-center rounded-l-lg text-gray-400">@</span>
              <input
                type="text"
                name="socialLinks.twitch"
                value={profileData.socialLinks.twitch}
                onChange={handleChange}
                placeholder="seu_usuario"
                className="flex-1 bg-white/5 border border-white/10 border-l-0 rounded-r-lg px-4 py-2 text-white placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Preferências</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="preferences.notifications"
              checked={profileData.preferences.notifications}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 ${profileData.preferences.notifications ? 'bg-white' : 'bg-gray-600'} rounded-full relative transition-colors duration-200`}>
              <div className={`w-4 h-4 bg-black absolute rounded-full transform transition-transform duration-200 ${profileData.preferences.notifications ? 'translate-x-5' : 'translate-x-1'} top-1`}></div>
            </div>
            <span className="text-white">Receber notificações</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="preferences.newsletter"
              checked={profileData.preferences.newsletter}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 ${profileData.preferences.newsletter ? 'bg-white' : 'bg-gray-600'} rounded-full relative transition-colors duration-200`}>
              <div className={`w-4 h-4 bg-black absolute rounded-full transform transition-transform duration-200 ${profileData.preferences.newsletter ? 'translate-x-5' : 'translate-x-1'} top-1`}></div>
            </div>
            <span className="text-white">Inscrever-se na newsletter</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="preferences.publicProfile"
              checked={profileData.preferences.publicProfile}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 ${profileData.preferences.publicProfile ? 'bg-white' : 'bg-gray-600'} rounded-full relative transition-colors duration-200`}>
              <div className={`w-4 h-4 bg-black absolute rounded-full transform transition-transform duration-200 ${profileData.preferences.publicProfile ? 'translate-x-5' : 'translate-x-1'} top-1`}></div>
            </div>
            <span className="text-white">Perfil público</span>
          </label>
        </div>
      </div>
      
      {saveStatus.message && (
        <div className={`p-4 rounded-lg ${
          saveStatus.type === 'error' ? 'bg-red-900/50 text-red-200' : 
          saveStatus.type === 'success' ? 'bg-green-900/50 text-green-200' :
          'bg-gray-800 text-white'
        }`}>
          {saveStatus.type === 'loading' && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{saveStatus.message}</span>
            </div>
          )}
          {saveStatus.type !== 'loading' && saveStatus.message}
        </div>
      )}
    </form>
  );
  
  return (
    <div className="min-h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-gray-400">Gerencie suas informações pessoais e preferências</p>
        </div>
        
        <div className="bg-gradient-to-br from-black to-[#1a1a24] rounded-2xl border border-white/20 p-6">
          {isEditing ? renderEditMode() : renderViewMode()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

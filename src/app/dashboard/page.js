'use client'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProfileSection from '@/components/ProfileSection'
import QuestsSection from '@/components/QuestsSection'
import RewardsSection from '@/components/RewardsSection';

const loadRealMatches = () => {
  return [
    {
      vs: "The Mongolz",
      game: "CS2",
      date: "10 de maio, 08:00",
      tournament: "PGL Astana 2025",
      logo: "/furia-logo.png",
      eventPage: "https://www.hltv.org/events/7737/pgl-astana-2025"
    },
    {
      vs: "Torneio Classificatório",
      game: "CS2",
      date: "19 a 25 de maio",
      tournament: "IEM Dallas 2025",
      logo: "/furia-logo.png",
      eventPage: "https://www.hltv.org/team/8297/furia"
    },
    {
      vs: "Fase de Grupos",
      game: "CS2",
      date: "2 a 8 de junho",
      tournament: "BLAST.tv Austin Major",
      logo: "/furia-logo.png",
      eventPage: "https://www.hltv.org/team/8297/furia"
    }
  ];
};

export default function Dashboard() {
  const router = useRouter();
  
  const [userData, setUserData] = useState(null);
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const realMatches = loadRealMatches();
    setMatches(realMatches);

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/user/${user._id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Dados do usuário:", data);
          
          setUserData({
            nickname: data.nickname || user.nickname || 'Usuário FURIA',
            name: data.name || '',
            email: data.email || user.email || '',
            birthdate: data.birthdate || '',
            location: data.location || '',
            bio: data.bio || '',
            level: data.level || 1,
            points: data.points || 0,
            nextLevel: data.nextLevel || 100,
            quests: data.quests || { completed: 0, total: 4 },
            socialLinks: data.socialLinks || {
              twitter: '',
              instagram: '',
              twitch: ''
            },
            preferences: data.preferences || {
              notifications: true,
              newsletter: false,
              publicProfile: true
            }
          });
        } else {
          setUserData({
            nickname: user.nickname || 'Usuário FURIA',
            name: '',
            email: user.email || '', 
            level: 1,
            points: 0,
            nextLevel: 100,
            quests: { completed: 0, total: 4 },
            socialLinks: {
              twitter: '',
              instagram: '',
              twitch: ''
            },
            preferences: {
              notifications: true,
              newsletter: false,
              publicProfile: true
            }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setUserData({
          nickname: user.nickname || 'Usuário FURIA',
          name: '',
          email: user.email || '', 
          level: 1,
          points: 0,
          nextLevel: 100,
          quests: { completed: 0, total: 4 },
          socialLinks: {
            twitter: '',
            instagram: '',
            twitch: ''
          },
          preferences: {
            notifications: true,
            newsletter: false,
            publicProfile: true
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner de carregamento */}
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Renderização condicional
  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg text-white text-center">
          <p className="text-xl mb-4">Não foi possível carregar os dados</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  // Função para renderizar as partidas
  const renderMatches = () => {
    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      return <p className="text-gray-400">Nenhuma partida encontrada</p>;
    }
    
    return matches.map((match, index) => (
      <div key={index} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between hover:bg-gray-700 transition-colors border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Image 
              src="/furia-logo.png" 
              alt="FURIA" 
              width={30} 
              height={30} 
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-white font-bold">
              {match.tournament && (
                <span className="text-gray-400 text-xs block">{match.tournament}</span>
              )}
              FURIA vs {match.vs}
            </p>
            <p className="text-gray-400 text-sm">{match.game} • {match.date}</p>
          </div>
        </div>
        
        <a 
          href={match.eventPage} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-full transition-colors"
        >
          Detalhes
        </a>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-[#111] border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
          <Image 
              src="/furia-player.png" 
              alt="FURIA" 
              width={60} 
              height={60} 
              className="object-contain"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Bem-vindo,</p>
              <p className="font-bold text-white">{userData?.nickname || 'Fã FURIA'}</p>
            </div>
            <button 
              onClick={() => logout && logout()}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black/80 backdrop-blur-lg border-r border-white/20 hidden md:block">
          <div className="p-4 h-full flex flex-col">
            <nav className="space-y-2 flex-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { id: 'perfil', label: 'Meu Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'missoes', label: 'Missões', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { id: 'recompensas', label: 'Recompensas', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id 
                      ? 'bg-white/10 text-white border border-white/30'
                      : 'text-gray-400 hover:bg-black/30'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Progresso do Usuário */}
            <div className="mt-8 p-4 bg-black/30 rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white">Nível {userData?.level}</span>
                <span className="text-xs text-gray-400">{userData?.points}/{userData?.nextLevel} XP</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-white to-gray-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((userData?.points || 0) / (userData?.nextLevel || 100)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Área Principal do Dashboard */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-black/80 to-[#0a0a0c]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <>
                {/* Conteúdo atual do dashboard */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Olá, {userData?.nickname}!</h1>
                  <p className="text-gray-400">Complete missões, ganhe recompensas e fique por dentro de tudo sobre a FURIA. Quanto mais você participar, mais recompensas exclusivas você desbloqueia!</p>
                </div>

                {/* Grid de Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Card de Nível */}
                  <div className="bg-gradient-to-br from-black to-[#1a1a24] p-6 rounded-2xl border border-white/20 relative overflow-hidden group hover:border-white/40 transition-all duration-300 shadow-lg">
                    {/* brilho */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Seu Nível</p>
                        <p className="text-4xl font-bold text-white">{userData.level}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Missões */}
                  <div className="bg-gradient-to-br from-black to-[#1a1a24] p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Missões Completas</p>
                        <p className="text-4xl font-bold text-white">{userData?.quests?.completed || 0}/{userData?.quests?.total || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card de Pontos */}
                  <div className="bg-gradient-to-br from-black to-[#1a1a24] p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">FURIA Points</p>
                        <p className="text-4xl font-bold text-white">{userData?.points || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Próximos Jogos */}
                <div className="bg-gradient-to-br from-black to-[#1a1a24] rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Próximas Partidas da FURIA</h2>
                    <a href="https://www.hltv.org/team/8297/furia" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                      Ver todos
                    </a>
                  </div>
                  
                  <div className="space-y-4">
                    {renderMatches()}
                  </div>
                </div>
              </>
            )}
            
            {/* Seção do Perfil */}
            {activeTab === 'perfil' && (
              <ProfileSection 
                userData={userData}
                user={user}
                updateUserData={updateUserData}
              />
            )}
            
            {/* Placeholder para outras abas */}
            {activeTab === 'missoes' && <QuestsSection userData={userData} updateUserData={updateUserData} />}
            
            {activeTab === 'recompensas' && (
  <RewardsSection userData={userData} updateUserData={updateUserData} />
)}
          </div>
        </main>
      </div>

      {/* Navegação Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/20 backdrop-blur-lg">
        <div className="grid grid-cols-4 gap-2 p-2">
          {[
            { id: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'missoes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'recompensas', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl flex items-center justify-center ${
                activeTab === item.id
                  ? 'text-white bg-white/10'
                  : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

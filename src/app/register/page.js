'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    favoriteGame: 'CS2',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('Você precisa concordar com os termos para se cadastrar');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao cadastrar');
      }
    } catch (error) {
      setError('Falha na conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Painel Esquerdo - Formulário */}
      <div className="w-full md:w-[45%] bg-white p-10 flex items-center overflow-y-auto">
        <div className="w-full max-w-md mx-auto py-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">Crie sua conta</h1>
            <p className="text-gray-500 mt-1">Entre para a comunidade FURIA e tenha acesso a conteúdo exclusivo.</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nickname">
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                placeholder="Como você quer ser chamado"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Crie uma senha"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirme sua senha"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                  Idade
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  required
                  placeholder="Sua idade"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="favoriteGame">
                  Jogo Favorito
                </label>
                <select
                  id="favoriteGame"
                  name="favoriteGame"
                  value={formData.favoriteGame}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
                >
                  <option value="CS2">Counter-Strike 2</option>
                  <option value="Valorant">Valorant</option>
                  <option value="LoL">League of Legends</option>
                  <option value="R6">Rainbow Six Siege</option>
                  <option value="Apex">Apex Legends</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-start mt-6">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black mt-1 text-black"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                Concordo com os <a href="#" className="text-black font-medium hover:underline">Termos de Uso</a> e <a href="#" className="text-black font-medium hover:underline">Política de Privacidade</a> da FURIA.
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full p-3 bg-black text-white font-bold rounded-md hover:bg-gray-900 transition-all flex items-center justify-center mt-6" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CADASTRANDO
                </>
              ) : 'CRIAR CONTA'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem uma conta? <Link href="/login" className="text-black font-semibold hover:underline">Faça login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Painel Direito */}
      <div className="hidden md:block md:w-[55%] bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3),rgba(0,0,0,0.8))]"></div>
        
        {/* Grade de fundo */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        {/* Conteúdo do painel direito */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-center">
          <Image 
            src="/furia-player.png" 
            alt="FURIA Player" 
            width={500} 
            height={300}
            className="mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transform hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-4">SEJA PARTE DA ELITE</h2>
            <p className="text-gray-300 text-lg">
              Receba notificações de partidas, acesso a conteúdo exclusivo e muito mais sendo parte da família FURIA.
            </p>
          </div>
        </div>
        
        {/* Efeito de partículas */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </div>
  );
}

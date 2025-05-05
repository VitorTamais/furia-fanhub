'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import LoadingScreen from '@/components/LoadingScreen'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const [credentials, setCredentials] = useState({
    nickname: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowLoadingScreen(true);
    setError('');
    
    try {
      const success = await login(credentials);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas');
        setShowLoadingScreen(false);
      }
    } catch (error) {
      setError('Falha na conexão. Tente novamente.');
      setShowLoadingScreen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex">
      {showLoadingScreen && <LoadingScreen />}
      {/* Painel Esquerdo - Formulário */}
      <div className="w-full md:w-[45%] bg-white p-10 flex items-center">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-black">Bem-vindo(a)!</h1>
            <p className="text-gray-500 mt-1">Faça login ou cadastre-se para começar a fazer parte da comunidade FURIA.</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={credentials.nickname}
                onChange={handleChange}
                required
                placeholder="Digite seu nickname"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Senha
                </label>
                <a href="#" className="text-sm text-black hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Digite sua senha"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={credentials.remember}
                onChange={handleChange}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black text-black"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Lembrar de mim
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full p-3 bg-black text-white font-bold rounded-md hover:bg-gray-900 transition-all flex items-center justify-center" 
              disabled={isSubmitting}
            >
              ENTRAR
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Ainda não tem uma conta? <Link href="/register" className="text-black font-semibold hover:underline">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Painel Direito */}
      <div className="hidden md:block md:w-[55%] bg-black relative overflow-hidden">
        {/* Restante do código do painel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3),rgba(0,0,0,0.8))]"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-center">
          <Image 
            src="/furia-player.png" 
            alt="FURIA Player" 
            width={400} 
            height={400}
            className="mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transform hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-4">JUNTE-SE À NAÇÃO FURIA</h2>
            <p className="text-gray-300 text-lg">
              Faça parte da maior comunidade de fãs de esports do Brasil e tenha acesso exclusivo a conteúdos, eventos e muito mais.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </div>
  );
}

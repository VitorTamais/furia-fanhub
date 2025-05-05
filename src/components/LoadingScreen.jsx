'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 5
      })
    }, 100)
    
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Grade de fundo */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      {/* Efeito de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-10 relative">
          <Image 
            src="/furia-logo.png" 
            alt="FURIA" 
            width={180} 
            height={75} 
            className="drop-shadow-[0_0_15px_rgba(255,182,18,0.6)]"
          />
          
          {/* Partículas animadas */}
          <div className="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(255,182,18,0.15),transparent_70%)] animate-pulse"></div>
        </div>
        
        {/* Spinner personalizado da FURIA */}
        <div className="relative w-16 h-16 mb-8">
          <svg 
            className="animate-spin w-full h-full" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M50 10C69.33 10 85 25.67 85 45C85 64.33 69.33 80 50 80C30.67 80 15 64.33 15 45C15 25.67 30.67 10 50 10Z" 
              stroke="#ffb612" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeDasharray="180 250"
              className="animate-dash"
            />
            <path 
              d="M50 90C77.61 90 100 67.61 100 40C100 12.39 77.61 -10 50 -10C22.39 -10 0 12.39 0 40C0 67.61 22.39 90 50 90Z" 
              stroke="rgba(255,182,18,0.4)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="360"
              className="animate-dash-slow"
            />
          </svg>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-60 h-1 bg-gray-800 rounded-full mb-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#ffb612] to-[#ffd700] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Texto de status */}
        <div className="text-center">
          <p className="text-white text-lg font-medium mb-1">Carregando seu perfil</p>
          <p className="text-gray-400 text-sm">Preparando sua experiência na FURIA</p>
        </div>
      </div>
      
      {/* Silhueta da pantera */}
      <div className="absolute bottom-6 right-6 opacity-20 w-32 h-32">
        <svg 
          viewBox="0 0 256 256" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M128 20C160 20 192 52 192.5 84C193 116 176 128 160 144C144 160 128 176 128 208" 
            stroke="#ffb612" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          {/* mais elementos da silhueta da pantera */}
        </svg>
      </div>
      
      {/* Efeito de vinheta nas bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]"></div>
    </div>
  )
}

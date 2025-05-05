'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function RewardsSection({ userData, updateUserData }) {
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const rewards = [
    {
      id: 'camisa-furia',
      title: 'Camisa Oficial FURIA',
      description: 'Camisa oficial do time FURIA, modelo 2025 produzida pela Adidas.',
      points: 1500,
      image: '/furia-jersey.png',
      available: true
    }
  ];

  const openRedeemModal = (reward) => {
    setSelectedReward(reward);
  };

  const closeModal = () => {
    setSelectedReward(null);
    setIsRedeeming(false);
    setRedeemSuccess(false);
  };

  const redeemReward = () => {
    setIsRedeeming(true);
    
    setTimeout(() => {
      setIsRedeeming(false);
      
      if (userData.points >= selectedReward.points) {
        const updatedUserData = {
          ...userData,
          points: userData.points - selectedReward.points
        };
        
        updateUserData(updatedUserData);
        
        setRedeemSuccess(true);
      } else {
        alert('Pontos insuficientes para resgatar esta recompensa!');
        closeModal();
      }
    }, 1500); 
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Recompensas FURIA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map(reward => (
          <div 
            key={reward.id}
            className={`p-6 rounded-xl border-2 transition-all ${
              !reward.available
                ? 'border-gray-600 bg-gray-800/30 opacity-75'
                : userData.points >= reward.points
                  ? 'border-green-500 hover:border-green-400 cursor-pointer'
                  : 'border-gray-700 hover:border-white cursor-pointer'
            }`}
            onClick={() => reward.available && openRedeemModal(reward)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{reward.title}</h3>
                <p className="text-gray-400 mt-1">{reward.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                userData.points >= reward.points 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-black'
              }`}>
                {reward.points} pontos
              </span>
            </div>
            
            <div className="mt-4 flex justify-center">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
                <Image 
                  src={reward.image} 
                  alt={reward.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <button
                className={`w-full py-3 rounded-lg font-bold ${
                  userData.points >= reward.points && reward.available
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {userData.points >= reward.points 
                  ? 'Resgatar Recompensa' 
                  : `Necessário ${reward.points - userData.points} pontos a mais`}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal de resgate */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            {!redeemSuccess ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">Confirmar Resgate</h2>
                <p className="text-gray-300 mb-6">
                  Você está prestes a resgatar <span className="text-white font-bold">{selectedReward.title}</span> por <span className="text-green-500 font-bold">{selectedReward.points} pontos</span>.
                </p>
                
                <div className="mb-6 flex justify-center">
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-700">
                    <Image 
                      src={selectedReward.image} 
                      alt={selectedReward.title}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={redeemReward}
                    className="flex-1 py-3 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600"
                  >
                    {isRedeeming ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : 'Confirmar Resgate'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Resgate Concluído!</h2>
                <p className="text-gray-300 mb-6">
                  Você resgatou com sucesso a {selectedReward.title}. Nossa equipe entrará em contato para confirmar os detalhes de entrega.
                </p>
                
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

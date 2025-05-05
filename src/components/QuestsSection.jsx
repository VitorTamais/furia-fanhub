'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function QuestsSection({ userData, updateUserData }) {
  const { user } = useAuth();
  const [quests, setQuests] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/quests')
      .then(res => res.json())
      .then(setQuests)
      .catch(console.error);
  }, []);

  const isQuestCompleted = (questId) => {
    return userData?.completedMissions?.includes(questId);
  };

  const validateQuiz = (quest) => {
    if (!quest.config?.questions) return true;
    
    const totalQuestions = quest.config.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions !== totalQuestions) {
      setValidationError(`Responda todas as ${totalQuestions} perguntas!`);
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert('Vídeo recebido com sucesso!');
    }
  };

  const handleComplete = async (quest) => {
    if (quest.type === 'quiz' && !validateQuiz(quest)) return;
  
    try {
      const res = await fetch(`/api/user/${user._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          missionId: quest.id,
          xp: quest.xp,
          answers
        })
      });
  
      if (!res.ok) throw new Error('Falha ao completar missão');
      
      const completedMissions = [...(userData.completedMissions || []), quest.id];
      
      const newXP = (userData.xp || 0) + quest.xp;
      const newLevel = calculateLevel(newXP);
      
      let nextLevelXP;
      if (newLevel === 1) nextLevelXP = 1000;
      else if (newLevel === 2) nextLevelXP = 3000;
      else if (newLevel === 3) nextLevelXP = 6000;
      else if (newLevel === 4) nextLevelXP = 10000;
      else nextLevelXP = Math.pow(newLevel + 1, 2) * 1000;
      
      const updatedUserData = {
        ...userData,
        completedMissions: completedMissions,
        xp: newXP,
        points: newXP, 
        level: newLevel,
        nextLevel: nextLevelXP, 
        quests: {
          completed: completedMissions.length,
          total: 4 
        }
      };
      
      updateUserData(updatedUserData);
      setActiveQuest(null);
      setAnswers({});
      
      alert(`Missão concluída! +${quest.xp}XP`);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const calculateLevel = (xp) => {
    if (xp < 1000) return 1;
    if (xp < 3000) return 2;
    if (xp < 6000) return 3;
    if (xp < 10000) return 4;
    return Math.floor(Math.sqrt(xp / 1000)) + 1;
  };

  const isHinoMission = (quest) => {
    return quest.type === 'video' || 
           quest.title?.includes("Hino") || 
           quest.id?.includes("hino") ||
           quest.description?.includes("hino");
  };

  const isSocialMission = (quest) => {
    return quest.type === 'social' || 
           quest.title?.includes("Siga") || 
           quest.id?.includes("social") ||
           quest.description?.includes("redes sociais");
  };

  const renderQuestContent = (quest) => {
    if (isHinoMission(quest)) {
      return (
        <div className="space-y-4">
          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputRef}
            onChange={handleVideoUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600"
          >
            Enviar Vídeo do Hino
          </button>
          <button
            onClick={() => handleComplete(quest)}
            className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Completar Missão
          </button>
        </div>
      );
    }
    
    if (isSocialMission(quest)) {
      return (
        <div className="space-y-4">
          <button
            onClick={() => window.open('https://www.instagram.com/furiagg/', '_blank')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90"
          >
            Seguir no Instagram
          </button>
          <button
            onClick={() => handleComplete(quest)}
            className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Completar Missão
          </button>
        </div>
      );
    }

    if (quest.type === 'quiz') {
      return (
        <div className="space-y-6">
          {quest.config?.questions?.map((q, i) => (
            <div key={i}>
              <p className="text-white text-lg mb-3">{q.question}</p>
              <div className="grid gap-2">
                {q.options?.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => setAnswers({...answers, [i]: j})}
                    className={`p-3 text-left rounded-lg transition-all ${
                      answers[i] === j 
                        ? 'bg-white text-black font-bold' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {validationError && (
            <p className="text-red-500">{validationError}</p>
          )}
          <button
            onClick={() => handleComplete(quest)}
            className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Finalizar Missão
          </button>
        </div>
      );
    }

    return (
      <div>
        <button
          onClick={() => handleComplete(quest)}
          className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100"
        >
          Completar Missão
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Missões FURIA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map(quest => (
          <div 
            key={quest.id}
            className={`p-6 rounded-xl border-2 transition-all ${
              isQuestCompleted(quest.id)
                ? 'border-green-500 bg-green-500/10 opacity-75'
                : 'border-gray-700 hover:border-white cursor-pointer'
            }`}
            onClick={() => !isQuestCompleted(quest.id) && setActiveQuest(quest)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                <p className="text-gray-400 mt-1">{quest.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-white text-black px-3 py-1 rounded-full text-sm">
                  {quest.xp}XP
                </span>
                {isQuestCompleted(quest.id) && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">✓</span>
                )}
              </div>
            </div>
            
            {activeQuest?.id === quest.id && (
              <div className="mt-4">
                {renderQuestContent(quest)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

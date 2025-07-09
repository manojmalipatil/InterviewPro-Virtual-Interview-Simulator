import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import BehavioralRound from '../components/rounds/BehavioralRound';
import TechnicalRound from '../components/rounds/TechnicalRound';
import CodingRound from '../components/rounds/CodingRound';
import SystemDesignRound from '../components/rounds/SystemDesignRound';
import RoundProgress from '../components/RoundProgress';
import { useInterviewContext } from '../context/InterviewContext';
import { getRole } from '../data/roles';

const InterviewRound = () => {
  const { roleId, roundId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useInterviewContext();
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Parse roundId to number, defaulting to 1 if invalid
  const currentRound = parseInt(roundId || '1', 10) || 1;
  const role = getRole(roleId || '');
  
  useEffect(() => {
    if (!role) {
      navigate('/role-selection');
    }
  }, [role, navigate]);

  const handleComplete = (roundResults: any) => {
    if (roleId) {
      dispatch({ 
        type: 'COMPLETE_ROUND', 
        payload: { 
          roleId, 
          roundId: currentRound.toString(), 
          results: roundResults 
        } 
      });
      setIsCompleted(true);
    }
  };

  const goToNextRound = () => {
    if (currentRound < 4) {
      navigate(`/interview/${roleId}/${currentRound + 1}`);
      setIsCompleted(false);
    } else {
      navigate(`/summary/${roleId}`);
    }
  };

  if (!role) return null;

  const renderRound = () => {
    switch (currentRound) {
      case 1:
        return <BehavioralRound roleId={roleId || ''} onComplete={handleComplete} />;
      case 2:
        return <TechnicalRound roleId={roleId || ''} onComplete={handleComplete} />;
      case 3:
        return <CodingRound roleId={roleId || ''} onComplete={handleComplete} />;
      case 4:
        return <SystemDesignRound roleId={roleId || ''} onComplete={handleComplete} />;
      default:
        return <div>Invalid round</div>;
    }
  };

  const getRoundName = () => {
    switch (currentRound) {
      case 1: return 'HR & Behavioral';
      case 2: return 'Technical Q&A';
      case 3: return 'Coding Challenge';
      case 4: return 'System Design';
      default: return 'Interview Round';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/role-selection')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Roles
        </Button>
        
        <RoundProgress currentRound={currentRound} />
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h2 className="text-sm text-gray-600 mr-2">
            Interviewing for:
          </h2>
          <span className="font-semibold text-gray-800">{role.title}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800">
          Round {currentRound}: {getRoundName()}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {renderRound()}
      </div>

      {isCompleted && (
        <div className="mt-8 flex justify-end">
          <Button onClick={goToNextRound}>
            {currentRound < 4 ? 'Next Round' : 'View Summary'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default InterviewRound;
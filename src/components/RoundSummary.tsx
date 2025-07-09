import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';

interface RoundSummaryProps {
  roundId: number;
  roundName: string;
  data: {
    score: number;
    strengths: string[];
    improvements: string[];
    feedback: string;
  };
}

const RoundSummary: React.FC<RoundSummaryProps> = ({ roundId, roundName, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all border hover:border-blue-400">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-full font-semibold text-lg flex items-center justify-center shadow"
            style={{
              backgroundColor: getBackgroundColor(roundId),
              color: getTextColor(roundId)
            }}
          >
            {roundId}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{roundName}</h3>
            <p className="text-sm text-gray-600">Score: <span className="font-semibold">{data.score}%</span> · {getScoreLabel(data.score)}</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Feedback</h4>
            <p className="bg-gray-100 rounded-md p-3 text-gray-700">{data.feedback}</p>
          </div>

          <div>
            <h4 className="font-semibold text-green-700 mb-1">Strengths</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.strengths.map((point, idx) => (
                <li key={`strength-${idx}`} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-700 mb-1">Areas of Improvement</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.improvements.map((point, idx) => (
                <li key={`improvement-${idx}`} className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const getBackgroundColor = (roundId: number) => {
  switch (roundId) {
    case 1: return '#EBF5FF';
    case 2: return '#E6FFFA';
    case 3: return '#F3E8FF';
    case 4: return '#FFFBEB';
    default: return '#F3F4F6';
  }
};

const getTextColor = (roundId: number) => {
  switch (roundId) {
    case 1: return '#3B82F6';
    case 2: return '#0D9488';
    case 3: return '#9333EA';
    case 4: return '#F59E0B';
    default: return '#6B7280';
  }
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Improvement';
};

export default RoundSummary;

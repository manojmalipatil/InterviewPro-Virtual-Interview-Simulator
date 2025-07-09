import React from 'react';

interface RoundProgressProps {
  currentRound: number;
}

const RoundProgress: React.FC<RoundProgressProps> = ({ currentRound }) => {
  return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4].map((round) => (
        <React.Fragment key={round}>
          <div 
            className={`
              h-3 w-3 rounded-full 
              ${round === currentRound 
                ? 'bg-blue-600 animate-pulse' 
                : round < currentRound 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300'
              }
            `}
          />
          {round < 4 && (
            <div 
              className={`
                h-0.5 w-6 
                ${round < currentRound ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RoundProgress;
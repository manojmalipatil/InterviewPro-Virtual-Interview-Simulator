import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Role } from '../types';

interface RoleCardProps {
  role: Role;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div 
            className="w-12 h-12 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: role.color + '20', color: role.color }}
          >
            {role.icon}
          </div>
          <div className="bg-gray-100 text-xs font-medium px-2.5 py-1 rounded-full text-gray-800">
            {role.category}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {role.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {role.description}
        </p>
        
        <div className="flex items-center text-blue-600 font-medium">
          Start Interview
          <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
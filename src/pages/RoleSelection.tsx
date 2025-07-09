import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { availableRoles } from '../data/roles';
import RoleCard from '../components/RoleCard';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRoles = availableRoles.filter(role => 
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Button>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Select Your Role</h1>
        <p className="text-lg text-gray-600">
          Choose the role you want to interview for. We'll customize the questions based on your selection.
        </p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for a role..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRoles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No roles match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map(role => (
            <RoleCard 
              key={role.id} 
              role={role} 
              onClick={() => navigate(`/interview/${role.id}/1`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
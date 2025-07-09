import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="text-9xl font-bold text-gray-200">404</div>
      <h1 className="text-3xl font-bold text-gray-800 mt-6">Page Not Found</h1>
      <p className="text-gray-600 mt-3 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button 
        className="mt-8"
        onClick={() => navigate('/')}
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
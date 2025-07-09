import React from 'react';
import { 
  Cpu,
  Code2,
  Shield,
  Cloud
} from 'lucide-react';
import { Role } from '../types';

export const availableRoles: Role[] = [
  {
    id: 'ai',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    description: 'Develop machine learning models and AI applications to solve complex problems.',
    color: '#6366F1',
    icon: <Cpu className="w-6 h-6" />
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    category: 'Web Development',
    description: 'Create end-to-end applications spanning both frontend and backend technologies.',
    color: '#8B5CF6',
    icon: <Code2 className="w-6 h-6" />
  },
  {
    id: 'security',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    description: 'Protect systems and networks from threats, vulnerabilities, and attacks.',
    color: '#EF4444',
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 'devops',
    title: 'DevOps/MLOps Engineer',
    category: 'Infrastructure',
    description: 'Implement CI/CD pipelines and manage cloud infrastructure for ML systems.',
    color: '#F59E0B',
    icon: <Cloud className="w-6 h-6" />
  }
];

export const getRole = (roleId: string): Role | undefined => {
  return availableRoles.find(role => role.id === roleId);
};
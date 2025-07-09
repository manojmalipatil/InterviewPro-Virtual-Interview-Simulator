import { DivideIcon as LucideIcon } from 'lucide-react';
import aimlData from './questions/aiml_engineer.json';
import cyberData from './questions/cyber_analyst.json';
import devMlopsData from './questions/dev_mlops.json';
import fullstackData from './questions/full_stack.json';

type Question = {
  question: string;
  ideal_answer: string;
  keywords: string[];
};

const roleDataMap: Record<string, any[]> = {
  ai: aimlData,
  security: cyberData,
  devops: devMlopsData,
  fullstack: fullstackData,
};

const getQuestionsByCategory = (roleId: string, category: string): any[] => {
  const data = roleDataMap[roleId];
  if (!data) return [];
  return data.filter(q => q.category === category);
};

export const getBehavioralQuestions = (roleId: string): Question[] => {
  return getQuestionsByCategory(roleId, 'HR').map(q => ({
    question: q.question,
    ideal_answer: q.ideal_answer,
    keywords: q.keywords || [], // fallback if keywords are missing
  }));
};

export const getTechnicalQuestions = (roleId: string): any[] => {
  return getQuestionsByCategory(roleId, 'Technical Round 1');
};

export const getCodingProblems = (roleId: string): any[] => {
  return getQuestionsByCategory(roleId, 'coding');
};

export const getSystemDesignProblems = (roleId: string): any[] => {
  return getQuestionsByCategory(roleId, 'system_design');
};

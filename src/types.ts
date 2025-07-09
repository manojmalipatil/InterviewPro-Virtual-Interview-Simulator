import { ReactNode } from 'react';

export interface Role {
  id: string;
  title: string;
  category: string;
  description: string;
  color: string;
  icon: ReactNode;
}
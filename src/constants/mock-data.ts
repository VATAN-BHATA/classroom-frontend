import { Subject } from '@/types';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    department: 'CS',
    description: 'An introduction to programming, algorithms, and computational thinking.',
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    code: 'MATH201',
    name: 'Linear Algebra',
    department: 'Maths',
    description: 'Study of vectors, matrices, linear transformations, and systems of equations.',
    createdAt: '2026-01-15',
  },
  {
    id: 3,
    code: 'ENG110',
    name: 'Academic Writing',
    department: 'English',
    description: 'Develops academic research, argumentation, and writing skills.',
    createdAt: '2026-01-15',
  },
];

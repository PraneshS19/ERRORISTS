import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export const SearchBar: React.FC = () => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder="Search trends, keywords, or categories..."
        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
    </div>
  );
};
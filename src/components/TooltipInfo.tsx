import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TooltipInfoProps {
  text: string;
  children?: React.ReactNode;
}

export const TooltipInfo: React.FC<TooltipInfoProps> = ({ text, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <Info className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-1 inline cursor-help" />
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-white dark:bg-gray-800 border dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
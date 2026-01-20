import React from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const FilterPanel: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <h4 className="font-medium dark:text-white">Filters</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Category</label>
            <select className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Lifestyle</option>
              <option>Business</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Time Range</label>
            <select className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface GeoDistribution {
  region: string;
  intensity: number;
}

interface GeoSelectorProps {
  distributions: GeoDistribution[];
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export const GeoSelector: React.FC<GeoSelectorProps> = ({
  distributions,
  selectedRegion = 'Global',
  onRegionChange
}) => {
  const maxIntensity = Math.max(...distributions.map(d => d.intensity));

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Globe className="w-5 h-5" />
          Geo-Intelligent Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 dark:text-gray-300" />
            <h4 className="font-medium dark:text-white">Region Selector</h4>
          </div>
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="Global" className="dark:text-gray-300">Global View</SelectItem>
              {distributions.map((dist, index) => (
                <SelectItem key={index} value={dist.region} className="dark:text-gray-300">
                  {dist.region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium dark:text-white">Trend Intensity by Region</h4>
          <div className="space-y-3">
            {distributions.map((dist, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm dark:text-gray-300">
                  <span>{dist.region}</span>
                  <span className="font-medium">{dist.intensity}/100</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      dist.intensity > 80 ? 'bg-red-500' : 
                      dist.intensity > 60 ? 'bg-yellow-500' : 
                      dist.intensity > 40 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(dist.intensity / maxIntensity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedRegion !== 'Global' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-800 dark:text-green-300">Emerging Locally</span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-400 mt-1">
              This trend is gaining significant traction in {selectedRegion}. 
              Local conversations are driving {distributions.find(d => d.region === selectedRegion)?.intensity}% 
              of the total trend intensity in this region.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
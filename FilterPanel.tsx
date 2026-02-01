import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, X, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { fieldThemes, ProgramField } from '@/app/types/program';

export interface FilterState {
  countries: string[];
  formats: string[];
  residenceTypes: string[];
  fields: string[];
  ageRange: [number, number];
  maxCost: number;
  hasLowIncomeDiscount: boolean;
  minAcceptanceRate: number;
  deadlineRange: 'all' | '30days' | '60days' | '90days';
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCountries: string[];
  availableFields: string[];
}

// Country flag mapping
const countryFlags: Record<string, string> = {
  'USA': '🇺🇸',
  'UK': '🇬🇧',
  'Singapore': '🇸🇬',
  'Germany': '🇩🇪',
  'Canada': '🇨🇦',
  'Netherlands': '🇳🇱',
  'Australia': '🇦🇺',
  'Switzerland': '🇨🇭',
  'New Zealand': '🇳🇿',
  'France': '🇫🇷',
  'Japan': '🇯🇵',
  'Ireland': '🇮🇪',
};

export function FilterPanel({ filters, onFiltersChange, availableCountries, availableFields }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState({
    country: true,
    deadline: true,
    format: false,
    residence: false,
    field: false,
    cost: false,
    other: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'countries' | 'formats' | 'residenceTypes' | 'fields', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      countries: [],
      formats: [],
      residenceTypes: [],
      fields: [],
      ageRange: [16, 25],
      maxCost: 200,
      hasLowIncomeDiscount: false,
      minAcceptanceRate: 0,
      deadlineRange: 'all',
    });
  };

  const activeFilterCount = 
    filters.countries.length + 
    filters.formats.length + 
    filters.residenceTypes.length + 
    filters.fields.length +
    (filters.hasLowIncomeDiscount ? 1 : 0) +
    (filters.deadlineRange !== 'all' ? 1 : 0) +
    (filters.minAcceptanceRate > 0 ? 1 : 0);

  const getActiveFilters = () => {
    const active = [];
    if (filters.countries.length) active.push(...filters.countries.map(c => ({ type: 'countries', value: c })));
    if (filters.formats.length) active.push(...filters.formats.map(f => ({ type: 'formats', value: f })));
    if (filters.residenceTypes.length) active.push(...filters.residenceTypes.map(r => ({ type: 'residenceTypes', value: r })));
    if (filters.fields.length) active.push(...filters.fields.map(f => ({ type: 'fields', value: f })));
    if (filters.hasLowIncomeDiscount) active.push({ type: 'hasLowIncomeDiscount', value: 'Low-income discount' });
    if (filters.deadlineRange !== 'all') active.push({ type: 'deadlineRange', value: filters.deadlineRange });
    return active;
  };

  const removeActiveFilter = (filter: { type: string; value: string }) => {
    if (filter.type === 'countries' || filter.type === 'formats' || filter.type === 'residenceTypes' || filter.type === 'fields') {
      toggleArrayFilter(filter.type, filter.value);
    } else if (filter.type === 'hasLowIncomeDiscount') {
      updateFilter('hasLowIncomeDiscount', false);
    } else if (filter.type === 'deadlineRange') {
      updateFilter('deadlineRange', 'all');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Filters in compact horizontal layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {/* Country */}
        <Collapsible open={openSections.country} onOpenChange={() => toggleSection('country')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-sm text-gray-900">Country</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transform ${openSections.country ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2 pb-3 space-y-2 max-h-48 overflow-y-auto">
            {availableCountries.map(country => (
              <div key={country} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`country-${country}`}
                    checked={filters.countries.includes(country)}
                    onCheckedChange={() => toggleArrayFilter('countries', country)}
                  />
                  <Label htmlFor={`country-${country}`} className="text-sm text-gray-700 cursor-pointer">
                    {country}
                  </Label>
                </div>
                <span className="text-base flex-shrink-0">{countryFlags[country] || '🌍'}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Program Direction */}
        <Collapsible open={openSections.field} onOpenChange={() => toggleSection('field')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-sm text-gray-900">Program Direction</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transform ${openSections.field ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2 pb-3 space-y-2 max-h-48 overflow-y-auto">
            {availableFields.map(field => {
              const theme = fieldThemes[field as ProgramField];
              return (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`field-${field}`}
                    checked={filters.fields.includes(field)}
                    onCheckedChange={() => toggleArrayFilter('fields', field)}
                  />
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: theme?.color || '#6b7280' }}
                  />
                  <Label htmlFor={`field-${field}`} className="text-sm text-gray-700 cursor-pointer capitalize flex-1">
                    {field.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Application Deadline */}
        <Collapsible open={openSections.deadline} onOpenChange={() => toggleSection('deadline')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-sm text-gray-900">Deadline</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transform ${openSections.deadline ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2 pb-3 space-y-2">
            {[
              { value: 'all', label: 'All deadlines' },
              { value: '30days', label: 'Within 30 days' },
              { value: '60days', label: 'Within 60 days' },
              { value: '90days', label: 'Within 90 days' },
            ].map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`deadline-${option.value}`}
                  checked={filters.deadlineRange === option.value}
                  onCheckedChange={() => updateFilter('deadlineRange', option.value as FilterState['deadlineRange'])}
                />
                <Label htmlFor={`deadline-${option.value}`} className="text-sm text-gray-700 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Program Format */}
        <Collapsible open={openSections.format} onOpenChange={() => toggleSection('format')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-sm text-gray-900">Format</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transform ${openSections.format ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2 pb-3 space-y-2">
            {['online', 'offline', 'hybrid'].map(format => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox 
                  id={`format-${format}`}
                  checked={filters.formats.includes(format)}
                  onCheckedChange={() => toggleArrayFilter('formats', format)}
                />
                <Label htmlFor={`format-${format}`} className="text-sm text-gray-700 cursor-pointer capitalize">
                  {format}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Cost & Discounts */}
        <Collapsible open={openSections.cost} onOpenChange={() => toggleSection('cost')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-sm text-gray-900">Cost</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transforms ${openSections.cost ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2 pb-3 space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Max Cost</span>
                <span className="font-medium">${filters.maxCost}</span>
              </div>
              <Slider 
                value={[filters.maxCost]} 
                onValueChange={([value]) => updateFilter('maxCost', value)}
                max={200}
                step={10}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="low-income-discount"
                checked={filters.hasLowIncomeDiscount}
                onCheckedChange={(checked) => updateFilter('hasLowIncomeDiscount', checked as boolean)}
              />
              <Label htmlFor="low-income-discount" className="text-sm text-gray-700 cursor-pointer">
                Low-income discount
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Other Filters */}
        <Collapsible open={openSections.other} onOpenChange={() => toggleSection('other')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-medium text-sm text-gray-900">More Options</span>
            <ChevronDown className={`size-4 text-gray-500 transition-transform ${openSections.other ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-2 pb-3 space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Min. Acceptance Rate</span>
                <span className="font-medium">{filters.minAcceptanceRate}%</span>
              </div>
              <Slider 
                value={[filters.minAcceptanceRate]} 
                onValueChange={([value]) => updateFilter('minAcceptanceRate', value)}
                max={100}
                step={5}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Age Range</span>
                <span className="font-medium">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
              </div>
              <Slider 
                value={filters.ageRange} 
                onValueChange={(value) => updateFilter('ageRange', value as [number, number])}
                min={16}
                max={25}
                step={1}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <div className="border-t border-gray-200 p-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="w-full rounded-full"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
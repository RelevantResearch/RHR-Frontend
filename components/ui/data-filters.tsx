'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  type?: 'select' | 'multiselect' | 'date' | 'text';
  placeholder?: string;
}

export interface DataFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  activeFilters?: Record<string, string | string[]>;
  onFilterChange?: (key: string, value: string | string[]) => void;
  onClearFilters?: () => void;
  className?: string;
  showMobileFilters?: boolean;
}

export function DataFilters({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  className,
  showMobileFilters = true,
}: DataFiltersProps) {
  const [showMobileFilterPanel, setShowMobileFilterPanel] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== 'all'
  );

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return value && value !== 'all' ? count + 1 : count;
    }, 0);
  };

  const handleFilterChange = (groupKey: string, optionValue: string, isMultiselect = false) => {
    if (!onFilterChange) return;

    if (isMultiselect) {
      const currentValues = (activeFilters[groupKey] as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onFilterChange(groupKey, newValues);
    } else {
      onFilterChange(groupKey, optionValue);
    }
  };

  const removeFilter = (groupKey: string, optionValue?: string) => {
    if (!onFilterChange) return;

    const currentValue = activeFilters[groupKey];
    if (Array.isArray(currentValue) && optionValue) {
      const newValues = currentValue.filter(v => v !== optionValue);
      onFilterChange(groupKey, newValues);
    } else {
      onFilterChange(groupKey, '');
    }
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const currentValue = activeFilters[group.key];
    const isMultiselect = group.type === 'multiselect';

    return (
      <div key={group.key} className="space-y-2">
        <label className="text-sm font-medium">{group.label}</label>
        {group.type === 'text' ? (
          <Input
            placeholder={group.placeholder}
            value={(currentValue as string) || ''}
            onChange={(e) => onFilterChange?.(group.key, e.target.value)}
          />
        ) : group.type === 'date' ? (
          <Input
            type="date"
            value={(currentValue as string) || ''}
            onChange={(e) => onFilterChange?.(group.key, e.target.value)}
          />
        ) : (
          <div className="space-y-1">
            {!isMultiselect && (
              <button
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md border hover:bg-muted/50",
                  (!currentValue || currentValue === 'all') && "bg-muted"
                )}
                onClick={() => handleFilterChange(group.key, 'all')}
              >
                All {group.label}
              </button>
            )}
            {group.options.map((option) => {
              const isSelected = isMultiselect 
                ? (currentValue as string[])?.includes(option.value)
                : currentValue === option.value;

              return (
                <button
                  key={option.value}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-md border hover:bg-muted/50",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleFilterChange(group.key, option.value, isMultiselect)}
                >
                  <div className="flex items-center justify-between">
                    {option.label}
                    {isMultiselect && isSelected && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;

    const badges = [];
    
    Object.entries(activeFilters).forEach(([groupKey, value]) => {
      const group = filterGroups.find(g => g.key === groupKey);
      if (!group || !value || value === 'all') return;

      if (Array.isArray(value)) {
        value.forEach(v => {
          const option = group.options.find(o => o.value === v);
          if (option) {
            badges.push(
              <Badge key={`${groupKey}-${v}`} variant="secondary" className="gap-1">
                {option.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter(groupKey, v)}
                />
              </Badge>
            );
          }
        });
      } else {
        const option = group.options.find(o => o.value === value);
        if (option) {
          badges.push(
            <Badge key={groupKey} variant="secondary" className="gap-1">
              {option.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter(groupKey)}
              />
            </Badge>
          );
        }
      }
    });

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        {badges}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-6 px-2 text-xs"
        >
          Clear all
        </Button>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4">
          {filterGroups.slice(0, 3).map((group) => (
            <Popover key={group.key}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {group.label}
                  {activeFilters[group.key] && activeFilters[group.key] !== 'all' && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {Array.isArray(activeFilters[group.key]) 
                        ? (activeFilters[group.key] as string[]).length
                        : '1'
                      }
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                {renderFilterGroup(group)}
              </PopoverContent>
            </Popover>
          ))}
        </div>

        {/* Mobile Filter Button */}
        {showMobileFilters && filterGroups.length > 0 && (
          <div className="md:hidden">
            <Popover open={showMobileFilterPanel} onOpenChange={setShowMobileFilterPanel}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {filterGroups.map(renderFilterGroup)}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClearFilters?.();
                        setShowMobileFilterPanel(false);
                      }}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {renderActiveFilters()}
    </div>
  );
}
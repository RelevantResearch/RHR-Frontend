'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface FilterOption {
  key: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

interface TableFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string | string[]>;
  onFilterChange: (key: string, value: string | string[]) => void;
  onClearFilters: () => void;
  className?: string;
}

export function TableFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterGroups,
  activeFilters,
  onFilterChange,
  onClearFilters,
  className,
}: TableFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== 'all'
  );

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value =>
      Array.isArray(value) ? value.length > 0 : value !== 'all'
    ).length;
  };

  const renderFilterBadges = () => {
    const badges = [];

    for (const [key, value] of Object.entries(activeFilters)) {
      if (Array.isArray(value) && value.length > 0) {
        const group = filterGroups.find(g => g.key === key);
        if (group) {
          badges.push(
            <Badge key={key} variant="secondary" className="gap-1">
              {group.label}: {value.length} selected
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterChange(key, [])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        }
      } else if (typeof value === 'string' && value !== 'all') {
        const group = filterGroups.find(g => g.key === key);
        const option = group?.options.find(o => o.value === value);
        if (group && option) {
          badges.push(
            <Badge key={key} variant="secondary" className="gap-1">
              {group.label}: {option.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterChange(key, 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        }
      }
    }

    return badges;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {filterGroups.map((group) => (
              <div key={group.key} className="min-w-[150px]">
                <Select
                  value={activeFilters[group.key] as string || 'all'}
                  onValueChange={(value) => onFilterChange(group.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${group.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {group.label}</SelectItem>
                    {group.options.map((option) => (
                      <SelectItem key={option.key} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {hasActiveFilters && (
              <Button variant="ghost" onClick={onClearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {renderFilterBadges()}
        </div>
      )}
    </div>
  );
}
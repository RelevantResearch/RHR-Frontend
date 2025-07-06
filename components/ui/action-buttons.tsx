'use client';

import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionButton {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  disabled?: boolean;
  renderCustom?: () => React.ReactNode;
}

interface ActionButtonsProps {
  actions: ActionButton[];
  className?: string;
}

export function ActionButtons({ actions, className }: ActionButtonsProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {actions.map((action, index) => {
        if (action.renderCustom) {
          return <div key={index}>{action.renderCustom()}</div>;
        }

        const Icon = action.icon;
        return (
          <Button
            key={index}
            variant={action.variant || 'ghost'}
            size="icon"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn("h-8 w-8", action.className)}
            title={action.label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}

// Common action button configurations
export const commonActions = {
  view: (onClick: () => void): ActionButton => ({
    label: 'View',
    onClick,
    icon: Eye,
    variant: 'ghost' as const,
  }),
  
  edit: (onClick: () => void): ActionButton => ({
    label: 'Edit',
    onClick,
    icon: Edit,
    variant: 'ghost' as const,
  }),
  
  delete: (onClick: () => void, itemType: string = 'item'): ActionButton => ({
    label: `Delete ${itemType}`,
    onClick,
    icon: Trash2,
    variant: 'ghost' as const,
    className: 'text-red-600 hover:text-red-700',
  }),
};
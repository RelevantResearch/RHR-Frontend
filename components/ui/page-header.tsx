'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  hidden?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: PageHeaderAction[];
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  actions = [],
  breadcrumbs,
  className,
  children,
}: PageHeaderProps) {
  const visibleActions = actions.filter(action => !action.hidden);

  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a 
                  href={crumb.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
            {badge && (
              <Badge variant={badge.variant || 'default'}>
                {badge.text}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
        
        {visibleActions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {visibleActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="w-full sm:w-auto"
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
}
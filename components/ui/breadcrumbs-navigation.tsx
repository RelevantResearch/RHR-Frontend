'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
  dynamicData?: {
    roleName?: string;
    projectName?: string;
    employeeName?: string;
    [key: string]: string | undefined;
  };
}

// ⛳️ Renamed to avoid name conflict
const generateDefaultBreadcrumbs = (
  pathname: string,
  searchParams?: URLSearchParams,
  dynamicData?: BreadcrumbNavigationProps['dynamicData']
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/dashboard', icon: Home }
  ];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    const labelMap: Record<string, string> = {
      'admin': 'Admin',
      'leave': 'Leave Management',
      'timesheets': 'Timesheets',
      'employees': 'Employees',
      'projects': 'Projects',
      'departments': 'Departments',
      'reports': 'Reports',
      'tickets': 'Tickets',
      'rbac': 'RBAC',
      'dashboard': 'Dashboard',
      'profile': 'Profile',
      'timesheet': 'My Timesheet',
      'my-projects': 'My Projects',
      'add': 'Add Project',
      'edit': 'Edit Project',
      'edit-project': 'Edit Project',
      'add-role': 'Add Role',
      'edit-role': 'Edit Role',
      'view-role': 'View Role'
    };

    let label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLastItem = index === segments.length - 1;

    if (segment === 'edit-role' && dynamicData?.roleName) {
      label = `Edit Role`;
    }

    // 🔒 Disable navigation for specific segments
    const nonNavigableSegments = ['admin'];

    breadcrumbs.push({
      label,
      href: isLastItem || nonNavigableSegments.includes(segment) ? undefined : currentPath
    });

  });

  if (pathname.includes('/edit-role') && dynamicData?.roleName) {
    breadcrumbs.push({ label: dynamicData.roleName });
  }
  if (pathname.includes('/view-role') && dynamicData?.roleName) {
    breadcrumbs.push({ label: dynamicData.roleName });
  }
  if (pathname.includes('/edit-employee') && dynamicData?.employeeName) {
    breadcrumbs.push({ label: dynamicData.employeeName });
  }

  return breadcrumbs;
};

export function BreadcrumbNavigation({ items, className, dynamicData }: BreadcrumbNavigationProps) {
  const pathname = usePathname() ?? '';
  const rawSearchParams = useSearchParams();

  const searchParams =
    typeof window !== 'undefined' && rawSearchParams
      ? new URLSearchParams(rawSearchParams.toString())
      : undefined;

  const breadcrumbItems = items || generateDefaultBreadcrumbs(pathname, searchParams, dynamicData);

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-6", className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
            )}

            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-foreground transition-colors"
              >
                {Icon && <Icon className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                "flex items-center",
                isLast ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {Icon && <Icon className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ✅ Use renamed function
export function useBreadcrumbs() {
  const pathname = usePathname() ?? '';
  const rawSearchParams = useSearchParams();

  const searchParams =
    typeof window !== 'undefined' && rawSearchParams
      ? new URLSearchParams(rawSearchParams.toString())
      : undefined;

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    return items;
  };

  const getBreadcrumbs = (dynamicData?: BreadcrumbNavigationProps['dynamicData']) => {
    return generateDefaultBreadcrumbs(pathname, searchParams, dynamicData);
  };

  return {
    setBreadcrumbs,
    getBreadcrumbs,
    pathname,
    searchParams
  };
}

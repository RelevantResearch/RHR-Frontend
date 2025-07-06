'use client';

import { GoSidebarCollapse } from "react-icons/go";
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useNotificationStore } from '@/lib/notification-store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Clock,
  FileText,
  KeyRound,
  LogOut,
  LayoutDashboard,
  FolderKanban,
  Building2,
  Settings,
  Menu,
  Calendar,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import PasswordChange from '@/components/auth/password-change';
import LoadingOverlayWrapper from '@/components/loading-overlay-wrapper';



interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (pathname === '/') {
    return <>{children}</>;
  }

  // Show loader while auth is loading
  if (isLoading || !user?.role?.name) {
    return <LoadingOverlayWrapper />;
  }

  // If not logged in, redirect to login page or show a login message/component
  if (!user) {
    router.push('/');
    return null;
  }

  // **NEW: Wait until user.role.name is loaded before rendering navigation**
  if (!user || !user.role || !user.role.name) {
    return <LoadingOverlayWrapper />;
  }


  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const roleName = user.role.name.toLowerCase();


  const adminLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/employees',
      label: 'Employees',
      icon: Users,
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      href: '/admin/timesheets',
      label: 'Timesheets',
      icon: Clock,
    },
    {
      href: '/admin/leave',
      label: 'Leave Management',
      icon: Calendar,
    },
    {
      href: '/departments',
      label: 'Department',
      icon: Building2,
    },
    // {
    //   href: '/calendar',
    //   label: 'Calendar',
    //   icon: CalendarDays,
    // },
    {
      href: '/reports',
      label: 'Reports',
      icon: FileText,
    },
    // {
    //   href: '/tickets',
    //   label: 'Tickets',
    //   icon: Ticket,
    // },
    {
      href: '/rbac',
      label: 'RBAC',
      icon: Shield,
    },
  ];

  const employeeLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/timesheet',
      label: 'My Timesheet',
      icon: Clock,
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      href: '/leave',
      label: 'Leave',
      icon: Calendar,
    },
    // {
    //   href: '/calendar',
    //   label: 'Calendar',
    //   icon: CalendarDays,
    // },
    {
      href: '/reports',
      label: 'Weekly Reports',
      icon: FileText,
    },
    // {
    //   href: '/tickets',
    //   label: 'Support',
    //   icon: Ticket,
    // },
  ];

  // console.log("Role Name:", roleName);

  const links = roleName === "admin" ? adminLinks : employeeLinks;

  const BrandLogo = () => {

    const showLabel = !isCollapsed || isMobile;

    return (
      <span className={cn(
        "relative flex items-center justify-center transition-opacity duration-300 delay-200 w-12 h-12 mt-4 mb-3",
        isCollapsed ? "w-12 h-12 mx-auto" : "w-auto"
      )}>
        {isCollapsed ? (
          <Image
            src="/Relevant Research_Icon_Color.png"
            alt="Relevant Research Mobile Logo"
            width={40}
            height={40}
            priority
          />
        ) : (
          <Image
            src="/Relevant Research_HZ_Color.png"
            alt="Relevant Research Desktop Logo"
            width={180}
            height={60}
            priority
          />
        )}
      </span>
    );
  };

  const NavLinks = ({ isMobileSheet = false }: { isMobileSheet?: boolean }) => (
    <ul className={cn(
      "flex-1 space-y-2 transition-all duration-500 delay-200 py-4",
      !isMobileSheet && !isMobile && isCollapsed ? "px-2" : "px-4"
    )}>
      {links.map((link) => {
        const Icon = link.icon;
        const showLabel = isMobileSheet || !isCollapsed || isMobile;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'flex items-center rounded-lg transition-all group relative overflow-hidden',
                !isMobileSheet && !isMobile && isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 space-x-3',
                pathname === link.href
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
              title={!isMobileSheet && !isMobile && isCollapsed ? link.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {showLabel && <span className={cn(
                "transition-opacity duration-300 delay-200",
                isCollapsed ? "opacity-0 invisible absolute" : "opacity-100 visible relative"
              )}>{link.label}</span>}


              {!isMobileSheet && !isMobile && isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200  delay-200 pointer-events-none whitespace-nowrap z-50">
                  {link.label}
                </div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-screen flex">

      {!isMobile && (
        <nav className={cn(
          "fixed top-0 left-0 bottom-0 bg-gray-900 text-white z-50 transition-all duration-500",
          isCollapsed ? "w-20" : "w-72"
        )}>
          <div className="flex flex-col h-full ">
            <BrandLogo />
            <NavLinks />
          </div>
        </nav>
      )}


      <div className={cn(
        "flex-1 transition-all duration-500",
        !isMobile && (isCollapsed ? "ml-16" : "ml-72")
      )}>

        <header className="bg-white border-b border-gray-200 px-6 py-2 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">

              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hover:bg-gray-100"
                >
                  <GoSidebarCollapse
                    className={`h-7 w-7 transform transition-transform duration-300 ${isCollapsed ? "scale-x-100" : "scale-x-[-1]"
                      }`}
                  />
                </Button>
              )}

              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0 bg-gray-900">
                    <div className="flex flex-col h-full py-6">
                      <BrandLogo />
                      <NavLinks isMobileSheet={true} />
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              <h1 className="text-2xl font-bold text-gray-900">HRMS</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 h-auto">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? undefined} />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPasswordChange(true)}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="bg-gray-50 min-h-[calc(100vh-73px)]">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
        <PasswordChange
          isOpen={showPasswordChange}
          onClose={() => setShowPasswordChange(false)}
          email={user?.email || ''}
        />
      </div>
    </div>
  );
}
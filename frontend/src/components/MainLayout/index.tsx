import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as MuiIcons from '@mui/icons-material';

import { apiService } from '~/services/api';
import { logger } from '~/configs/env';
import { getLocalizedName } from '~/utils/i18nResource';
import type { ResourceTreeDTO, CurrentUser, ViewState } from '~/types';
import {
  Box,
  Drawer,
  IconButton,
} from '@mui/material';

import TopAppBar from './TopAppBar';
import SideNav from './SideNav';

interface MainLayoutProps {
  currentUser: CurrentUser | null;
  currentView: ViewState;
  bgImage: string;
  onNavigate: (view: ViewState, url?: string) => void;
  children: React.ReactNode;
}

const DRAWER_WIDTH = 260;

const getIconComponent = (iconName?: string): React.ReactNode => {
  if (!iconName) return <MuiIcons.Apps />;
  const IconComponent = (MuiIcons as any)[iconName];
  return IconComponent ? <IconComponent /> : <MuiIcons.Apps />;
};

const fallbackNavItems = [
  { id: 'dashboard' as ViewState, labelKey: 'nav.dashboard', icon: <MuiIcons.Dashboard />, requireAdmin: false },
  { id: 'schedule' as ViewState, labelKey: 'nav.schedule', icon: <MuiIcons.CalendarMonth />, requireAdmin: false },
  { id: 'upcoming_tasks' as ViewState, labelKey: 'nav.upcomingTasks', icon: <MuiIcons.PlaylistPlay />, requireAdmin: false },
  { id: 'schedule_logs' as ViewState, labelKey: 'nav.scheduleLogs', icon: <MuiIcons.ListAlt />, requireAdmin: false },
];

function MainLayout({
  currentUser,
  currentView,
  bgImage,
  onNavigate,
  children,
}: MainLayoutProps) {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dynamicMenus, setDynamicMenus] = useState<ResourceTreeDTO[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const loadPermissions = async () => {
    try {
      const data = await apiService.getUserPermissions();
      setDynamicMenus(data.menus);
      setUserRoles(data.roles);
    } catch (err) {
      logger.warn('Failed to load dynamic menus, using fallback:', err);
      if (currentUser?.roles) {
        setUserRoles(currentUser.roles);
      }
    }
  };

  useEffect(() => {
    loadPermissions();
  }, [currentUser]);

  useEffect(() => {
    const handlePermissionRefresh = () => loadPermissions();
    globalThis.addEventListener('permissionRefresh', handlePermissionRefresh);
    return () => globalThis.removeEventListener('permissionRefresh', handlePermissionRefresh);
  }, []);

  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const getViewState = (code: string): ViewState | null => {
    const normalizedCode = code.toUpperCase();
    const viewMap: Record<string, ViewState> = {
      'DASHBOARD_SCHEDULER': 'dashboard',
      'SCHEDULER_MAIN': 'schedule',
      'UPCOMING_TASKS': 'upcoming_tasks',
      'SCHEDULE_LOGS': 'schedule_logs',
    };
    return viewMap[normalizedCode] || viewMap[code] || null;
  };

  const sortedDynamicMenus = [...dynamicMenus].sort((a, b) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    return aOrder !== bOrder ? aOrder - bOrder : String(a.code).localeCompare(String(b.code));
  });

  const flattenMenus = (menus: ResourceTreeDTO[]): ResourceTreeDTO[] => {
    const result: ResourceTreeDTO[] = [];
    menus.forEach(menu => {
      // Only include if it belongs to this system (mapped to a ViewState)
      if (getViewState(menu.code)) {
        result.push(menu);
      }
      if (menu.children && menu.children.length > 0) {
        result.push(...flattenMenus(menu.children));
      }
    });
    return result;
  };

  const allMenus = dynamicMenus.length > 0 ? flattenMenus(sortedDynamicMenus) : [];

  const navItems = allMenus.length > 0
    ? allMenus.map(menu => ({
        id: getViewState(menu.code)!,
        labelKey: getLocalizedName(menu, i18n.language),
        icon: getIconComponent(menu.icon),
        isTranslated: true,
        url: menu.url,
      }))
    : fallbackNavItems.filter(item => !item.requireAdmin || isAdmin);

  const handleNavClick = async (view: ViewState, url?: string) => {
    onNavigate(view, url);
    setMobileOpen(false);
  };

  const sideNav = (
    <SideNav 
      navItems={navItems}
      currentView={currentView}
      onNavigate={handleNavClick}
      currentUser={currentUser}
    />
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TopAppBar 
        onMenuClick={() => setMobileOpen(true)} 
        brandTitle={t('auth.brandSubtitle', 'SF Scheduler')}
      />

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          <Box className="flex justify-end p-2">
            <IconButton onClick={() => setMobileOpen(false)}>
              <MuiIcons.Close />
            </IconButton>
          </Box>
          {sideNav}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: DRAWER_WIDTH, 
              bgcolor: 'rgba(255,255,255,0.95)',
              borderRight: '1px solid #eee',
              mt: '64px',
              height: 'calc(100% - 64px)',
            },
          }}
          open
        >
          {sideNav}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;

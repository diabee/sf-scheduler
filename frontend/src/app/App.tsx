import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { apiService } from '~/services/api';
import { StorageService } from '~/services/storage';
import { logger, envConfig } from '~/configs/env';
import { handleError } from '~/utils/error';
import { getCacheFreeUrl } from '~/utils';
import type { CurrentUser, UserPermissionsDTO, ViewState, ResourceTreeDTO } from '~/types';
// Removed Portal import
import { DEFAULT_BACKGROUND } from '~/configs/constants';
import Dashboard from '~/pages/Dashboard';
import Login from '~/pages/Login';
import ScheduleManagement from '~/pages/ScheduleManagement';
import ScheduleLogs from '~/pages/ScheduleLogs';
import UpcomingTasks from '~/pages/UpcomingTasks';
import MainLayout from '~/components/MainLayout';
import AnimatedPage from '~/components/AnimatedPage';
import { Box, CircularProgress } from '@mui/material';

// Route path to ViewState mapping
const pathToViewState: Record<string, ViewState> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/schedule-management': 'schedule',
  '/upcoming-tasks': 'upcoming_tasks',
  '/schedule-logs': 'schedule_logs',
};

const viewStateToPath: Record<ViewState, string> = {
  login: '/login',
  dashboard: '/dashboard',
  schedule: '/schedule-management',
  upcoming_tasks: '/upcoming-tasks',
  schedule_logs: '/schedule-logs',
};

const getViewStateFromMenuCode = (code: string): ViewState | null => {
  const viewMap: Record<string, ViewState> = {
    dashboard: 'dashboard',
    MENU_DASHBOARD: 'dashboard',
    SCHEDULE_MGMT: 'schedule',
    UPCOMING_TASKS: 'upcoming_tasks',
    SCHEDULE_LOGS: 'schedule_logs',
  };

  const mapped = viewMap[code] || (code as ViewState);
  return mapped in viewStateToPath ? mapped : null;
};

const getDefaultPathFromPermissions = (permissions: UserPermissionsDTO | null): string => {
  if (!permissions) return '/dashboard';

  const flatten = (items: ResourceTreeDTO[]): ResourceTreeDTO[] => {
    const result: ResourceTreeDTO[] = [];
    items.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        result.push(...flatten(item.children));
      }
    });
    return result;
  };

  const allMenus = flatten(permissions.menus || []);
  for (const menu of allMenus) {
    const view = getViewStateFromMenuCode(menu.code);
    if (view) {
      return viewStateToPath[view];
    }
  }
  return '/dashboard';
};

const VERSION = '1.0.0';

// Inner component that uses router hooks
function AppContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bgImage, setBgImage] = useState(getCacheFreeUrl(DEFAULT_BACKGROUND));
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<UserPermissionsDTO | null>(null);

  // Get current view from path
  const currentView: ViewState = pathToViewState[location.pathname] || 'dashboard';

  const mapUserDTOToCurrentUser = useCallback((dto: { id: number; username: string; email: string; name?: string; department?: string; memo?: string; extension?: string; roles: string[]; enabled: boolean }): CurrentUser => ({
    id: String(dto.id),
    username: dto.username,
    email: dto.email,
    name: dto.name,
    department: dto.department,
    memo: dto.memo,
    extension: dto.extension,
    roles: dto.roles,
    enabled: dto.enabled,
  }), []);

  useEffect(() => {
    const init = async () => {
      try {
        const config = StorageService.getConfig();
        if (config.backgroundImage) {
          // Force a fresh fetch from storage even if it's the same URL
          setBgImage(getCacheFreeUrl(config.backgroundImage));
        }

        // Only verify on initial load
        if (isAuthenticated) return;

        const urlToken = searchParams.get('token');
        if (urlToken) {
          logger.info('Found SSO token in URL, initializing session...');
          apiService.setToken(urlToken);
          // Remove token from URL for security
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }

        const authPages = ['/login'];
        
        // Handle authentication bypass for local development
        if (envConfig.isAuthBypass && !urlToken) {
          logger.info('Authentication bypass is enabled. Setting mock user...');
          const mockUser = {
            id: 1,
            username: 'admin',
            email: 'admin@local.dev',
            name: 'Local Admin',
            roles: ['ROLE_ADMIN'],
            enabled: true
          };
          const mockPermissions: UserPermissionsDTO = {
            menus: [
              { id: 1, code: 'dashboard', name: 'Dashboard', type: 'MENU' as const, enabled: true, children: [], description: '', parentId: null, sortOrder: 0 },
              { id: 2, code: 'SCHEDULE_MGMT', name: '排程管理', type: 'MENU' as const, enabled: true, children: [], description: '', parentId: null, sortOrder: 1 },
              { id: 3, code: 'UPCOMING_TASKS', name: '任務清單', type: 'MENU' as const, enabled: true, children: [], description: '', parentId: null, sortOrder: 2 },
              { id: 4, code: 'SCHEDULE_LOGS', name: '排程日誌', type: 'MENU' as const, enabled: true, children: [], description: '', parentId: null, sortOrder: 3 }
            ],
            portals: [],
            permissions: ['ALL_PERMISSIONS'],
            roles: ['ROLE_ADMIN'],
          };
          
          setCurrentUser(mapUserDTOToCurrentUser(mockUser));
          setUserPermissions(mockPermissions);
          setIsAuthenticated(true);
          
          if (location.pathname === '/login' || location.pathname === '/') {
            navigate('/dashboard', { replace: true });
          }
          return;
        }

        const authUser = await apiService.verifyToken();
        
        if (authUser) {
          setCurrentUser(mapUserDTOToCurrentUser(authUser));
          setIsAuthenticated(true);

          if (!userPermissions) {
            try {
              const permissions = await apiService.getUserPermissions();
              setUserPermissions(permissions);
              
              // Only redirect if on login page or root
              if (location.pathname === '/login' || location.pathname === '/') {
                navigate(getDefaultPathFromPermissions(permissions), { replace: true });
              }
            } catch (err) {
              logger.warn('Failed to load user permissions during init, using fallback:', err);
              // Provide fallback permissions so the app doesn't get stuck
              const fallbackPermissions: UserPermissionsDTO = {
                menus: [{ id: 0, code: 'dashboard', name: 'Dashboard', type: 'MENU' as const, enabled: true, children: [], description: '', parentId: null, sortOrder: 0 }],
                portals: [],
                permissions: [],
                roles: authUser.roles || [],
              };
              setUserPermissions(fallbackPermissions);
              if (location.pathname === '/login' || location.pathname === '/') {
                navigate('/dashboard', { replace: true });
              }
            }
          }
        } else if (!authPages.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        logger.error('Init error:', error);
        const authPages = ['/login'];
        if (!authPages.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Listen for storage changes from other tabs (e.g. background image updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_config' && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          if (newConfig.backgroundImage) {
            setBgImage(getCacheFreeUrl(newConfig.backgroundImage));
          }
        } catch (err) {
          console.error('Failed to parse storage change:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleLogin = async (username: string, password: string, captchaId?: string, captchaCode?: string) => {
    setLoginError('');
    try {
      await apiService.login({ username, password, captchaId, captchaCode });
      const authUser = await apiService.getCurrentUser();
      setCurrentUser(mapUserDTOToCurrentUser(authUser));
      setIsAuthenticated(true);

      let permissions: UserPermissionsDTO | null = null;
      try {
        permissions = await apiService.getUserPermissions();
        setUserPermissions(permissions);
      } catch (err) {
        logger.warn('Failed to load user permissions during login:', err);
        setUserPermissions(null);
      }

      navigate(getDefaultPathFromPermissions(permissions), { replace: true });
    } catch (err) {
      const error = handleError(err, 'Login');
      setLoginError(error.message || t('auth.loginFailed'));
      throw err;
    }
  };



  const handleNavigate = (view: ViewState, url?: string) => {
    // If it's an external URL
    if (url?.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const path = viewStateToPath[view] || url;
    if (path) {
      navigate(path);
    }
  };



  // Route protection effect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
  }, [location.pathname, isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  // Auth routes (not authenticated)
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={
          <Login
            onLogin={handleLogin}
            error={loginError}
            bgImage={bgImage}
            version={VERSION}
          />
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Protected routes (authenticated)
  if (!userPermissions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const defaultPath = getDefaultPathFromPermissions(userPermissions);
  const allowedViews = new Set<ViewState>();
  
  const flattenMenus = (items: ResourceTreeDTO[]) => {
    items.forEach(item => {
      const view = getViewStateFromMenuCode(item.code);
      if (view) allowedViews.add(view);
      if (item.children && item.children.length > 0) {
        flattenMenus(item.children);
      }
    });
  };
  
  if (userPermissions.menus) {
    flattenMenus(userPermissions.menus);
  }

  return (
    <MainLayout
      currentUser={currentUser}
      currentView={currentView}
      bgImage={bgImage}
      onNavigate={handleNavigate}
    >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/dashboard"
              element={
                allowedViews.has('dashboard') ? (
                  <AnimatedPage>
                    <Dashboard />
                  </AnimatedPage>
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />
             <Route
              path="/schedule-management"
              element={
                <AnimatedPage>
                  <ScheduleManagement />
                </AnimatedPage>
              }
            />
            <Route
              path="/upcoming-tasks"
              element={
                <AnimatedPage>
                  <UpcomingTasks />
                </AnimatedPage>
              }
            />
            <Route
              path="/schedule-logs"
              element={
                <AnimatedPage>
                  <ScheduleLogs />
                </AnimatedPage>
              }
            />

            <Route path="/" element={<Navigate to={defaultPath} replace />} />
            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        </AnimatePresence>
    </MainLayout>
  );
}

// Main App component with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

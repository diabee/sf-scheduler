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
  const normalizedCode = code.toUpperCase();
  const viewMap: Record<string, ViewState> = {
    'DASHBOARD_SCHEDULER': 'dashboard',
    'SCHEDULER_MAIN': 'schedule',
    'SCHEDULE_MGMT': 'schedule',
    'UPCOMING_TASKS': 'upcoming_tasks',
    'SCHEDULE_LOGS': 'schedule_logs',
  };

  return viewMap[normalizedCode] || viewMap[code] || null;
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

  const currentView: ViewState = pathToViewState[location.pathname] || 'dashboard';

  const mapUserDTOToCurrentUser = useCallback((dto: any): CurrentUser => ({
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
          setBgImage(getCacheFreeUrl(config.backgroundImage));
        }

        const urlToken = searchParams.get('token');
        if (urlToken) {
          logger.info('Found SSO token in URL, initializing session...');
          apiService.setToken(urlToken);
          // Clean URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }

        // 2. Handle Auth Bypass for local development
        if (envConfig.isAuthBypass && !apiService.getToken()) {
          logger.info('Auth bypass mode enabled, skipping authentication...');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // 3. Verify existing or new token
        if (apiService.getToken()) {
          try {
            const authUser = await apiService.verifyToken();
            if (authUser) {
              setCurrentUser(mapUserDTOToCurrentUser(authUser));
              setIsAuthenticated(true);

              const permissions = await apiService.getUserPermissions();
              setUserPermissions(permissions);
              
              if (location.pathname === '/login' || location.pathname === '/') {
                navigate(getDefaultPathFromPermissions(permissions), { replace: true });
              }
              return; // Success, stop here
            }
          } catch (err) {
            logger.error('Token verification failed:', err);
            // If verification fails, we might still want to try OAuth2 or redirect
          }
        }

        // 4. Fallback: If not authenticated and no valid token, redirect to portal
        if (!envConfig.isAuthBypass) {
          // If we had a token but it failed, or we have no token at all,
          // redirect to the main portal login.
          logger.info('User not authenticated, redirecting to Portal Login...');
          window.location.href = envConfig.portalLoginUrl;
        }
      } catch (error) {
        logger.error('Init error:', error);
        if (!envConfig.isAuthBypass) {
           window.location.href = envConfig.portalLoginUrl;
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleLogin = async (username: string, password: string, captchaId?: string, captchaCode?: string) => {
    setLoginError('');
    try {
      await apiService.login({ username, password, captchaId, captchaCode });
      const authUser = await apiService.getCurrentUser();
      setCurrentUser(mapUserDTOToCurrentUser(authUser));
      setIsAuthenticated(true);

      const permissions = await apiService.getUserPermissions();
      setUserPermissions(permissions);

      navigate(getDefaultPathFromPermissions(permissions), { replace: true });
    } catch (err) {
      const error = handleError(err, 'Login');
      setLoginError(error.message || t('auth.loginFailed'));
      throw err;
    }
  };

  const handleNavigate = (view: ViewState, url?: string) => {
    if (url?.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    const path = viewStateToPath[view] || url;
    if (path) navigate(path);
  };

  if (isLoading) return null;

  // Render Login page if not authenticated
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

  // Handle Auth Bypass landing
  if (envConfig.isAuthBypass && !userPermissions) {
     return (
       <MainLayout
         currentUser={{ id: 'bypass', username: 'dev-user', name: 'Dev User', email: 'dev@d8ai.com', roles: ['ROLE_ADMIN'], enabled: true }}
         currentView={currentView}
         bgImage={bgImage}
         onNavigate={handleNavigate}
       >
         <AnimatePresence mode="wait">
           <Routes location={location} key={location.pathname}>
             <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
             <Route path="/schedule-management" element={<AnimatedPage><ScheduleManagement /></AnimatedPage>} />
             <Route path="/upcoming-tasks" element={<AnimatedPage><UpcomingTasks /></AnimatedPage>} />
             <Route path="/schedule-logs" element={<AnimatedPage><ScheduleLogs /></AnimatedPage>} />
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
             <Route path="*" element={<Navigate to="/dashboard" replace />} />
           </Routes>
         </AnimatePresence>
       </MainLayout>
     );
  }

  if (!userPermissions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const defaultPath = getDefaultPathFromPermissions(userPermissions);

  return (
    <MainLayout
      currentUser={currentUser}
      currentView={currentView}
      bgImage={bgImage}
      onNavigate={handleNavigate}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          <Route path="/schedule-management" element={<AnimatedPage><ScheduleManagement /></AnimatedPage>} />
          <Route path="/upcoming-tasks" element={<AnimatedPage><UpcomingTasks /></AnimatedPage>} />
          <Route path="/schedule-logs" element={<AnimatedPage><ScheduleLogs /></AnimatedPage>} />
          <Route path="/" element={<Navigate to={defaultPath} replace />} />
          <Route path="*" element={<Navigate to={defaultPath} replace />} />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

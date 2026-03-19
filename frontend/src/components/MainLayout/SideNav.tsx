import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import type { CurrentUser, ViewState } from '~/types';

interface NavItem {
  id: ViewState;
  labelKey: string;
  icon: React.ReactNode;
  isTranslated?: boolean;
  url?: string;
}

interface SideNavProps {
  navItems: NavItem[];
  currentView: ViewState;
  onNavigate: (view: ViewState, url?: string) => void;
  onLogout: () => void;
  currentUser: CurrentUser | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const SideNav = ({ 
  navItems, 
  currentView, 
  onNavigate, 
  onLogout, 
  currentUser 
}: SideNavProps) => {
  const { t } = useTranslation();

  return (
    <Box className="flex flex-col h-full overflow-hidden">
      <Box className="h-4" />

      <List 
        component={motion.ul}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 py-2"
      >
        {navItems.map(item => (
          <ListItemButton
            key={item.id}
            component={motion.div}
            variants={itemVariants}
            selected={currentView === item.id}
            onClick={() => onNavigate(item.id, item.url)}
            whileHover={{ x: 4 }}
            sx={{
              transition: 'background-color 0.2s',
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 107, 0, 0.08)',
                borderRight: '3px solid #FF6B00',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.12)' },
              },
              '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.04)' },
            }}
          >
            <ListItemIcon sx={{ color: '#FF6B00', opacity: 0.8, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.isTranslated ? item.labelKey : t(item.labelKey)} 
              sx={{ 
                color: '#FF6B00',
                '& .MuiTypography-root': { 
                  fontWeight: currentView === item.id ? 700 : 500,
                  fontSize: '0.9rem'
                }
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box className="p-4 border-t border-surface-border">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Box
            className="flex items-center gap-3 mb-4 p-2 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => onNavigate('profile')}
            sx={{ border: '1px solid transparent', '&:hover': { borderColor: 'rgba(0,0,0,0.05)' } }}
          >
            <Avatar sx={{ bgcolor: '#FF6B00', boxShadow: '0 2px 8px rgba(255,107,0,0.3)' }}>
              {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate text-text-primary">
                {currentUser?.name || currentUser?.username}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {currentUser?.email}
              </p>
            </Box>
            <SettingsIcon fontSize="small" className="text-gray-400" />
          </Box>
        </motion.div>
        
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ borderRadius: '10px' }}
        >
          {t('auth.logout')}
        </Button>
      </Box>
    </Box>
  );
};

export default SideNav;

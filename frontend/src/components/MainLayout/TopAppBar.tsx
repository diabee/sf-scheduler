import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LanguageSwitcher from '~/components/LanguageSwitcher';

interface TopAppBarProps {
  onMenuClick: () => void;
  brandTitle: string;
}

const TopAppBar = ({ onMenuClick, brandTitle }: TopAppBarProps) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: '#FF6B00',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' }, color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <Box sx={{ bgcolor: 'white', borderRadius: '50%', p: 0.5, display: 'flex', boxShadow: '0 0 15px rgba(255,255,255,0.3)' }}>
              <ScheduleIcon sx={{ fontSize: 24, color: '#FF6B00' }} />
            </Box>
          </motion.div>
          <h1 className="text-lg font-bold text-white tracking-wide">
            {brandTitle}
          </h1>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ 
          color: 'white',
          '& .MuiTypography-root, & .MuiSvgIcon-root': { color: 'white' } 
        }}>
          <LanguageSwitcher color="white" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;

import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { getCacheFreeUrl } from '~/utils';
import heroBg from '~/assets/dashboard_hero.png';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const stats = [
    { label: 'Total Tasks', value: '45', icon: <CalendarMonthIcon className="text-brand-orange" />, color: 'bg-orange-50' },
    { label: 'Successful', value: '38', icon: <CheckCircleOutlineIcon className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Failed', value: '3', icon: <ErrorOutlineIcon className="text-red-600" />, color: 'bg-red-50' },
    { label: 'Running', value: '4', icon: <AutorenewIcon className="text-blue-600" />, color: 'bg-blue-50' },
];

function Dashboard() {
  const { t } = useTranslation();

  return (
    <Box className="pb-8 flex flex-col gap-8">
      {/* Hero Welcome Banner */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 md:h-72 flex flex-col justify-center text-white p-8 md:p-12 overflow-hidden rounded-3xl shadow-xl shadow-brand-orange/20"
      >
        <Box
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(255, 107, 0, 0.9) 0%, rgba(255, 140, 0, 0.7) 100%), url("${getCacheFreeUrl(heroBg)}")`
          }}
        />
        <Box className="relative z-1 max-w-2xl">
          <Typography variant="h3" className="font-extrabold mb-2 drop-shadow-md">
            {t('dashboard.welcome', 'Welcome to SF Scheduler')}
          </Typography>
          <Typography variant="h6" className="opacity-90 font-light mb-6">
            {t('dashboard.subtitle', 'Enterprise-grade scheduling and management solution.')}
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
              <Paper 
                key={index}
                className={`p-6 rounded-2xl border border-surface-border flex flex-col items-center justify-center text-center transition-all hover:shadow-lg ${stat.color}`}
              >
                  <Box className="mb-2 scale-110">{stat.icon}</Box>
                  <Typography variant="h4" className="font-black text-text-primary mb-1">
                      {stat.value}
                  </Typography>
                  <Typography variant="caption" className="font-bold text-text-secondary uppercase tracking-wider">
                      {stat.label}
                  </Typography>
              </Paper>
          ))}
      </Box>

      {/* Main Content Area */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Paper className="p-8 rounded-2xl border border-surface-border bg-white shadow-sm flex flex-col items-center text-center">
          <Typography variant="h5" className="font-extrabold text-brand-orange mb-3">
            System Status
          </Typography>
          <Typography variant="body1" className="text-text-secondary leading-relaxed">
            All systems are functioning normally. Your scheduled tasks for today are progressing as planned.
          </Typography>
        </Paper>
        <Paper className="p-8 rounded-2xl border border-surface-border bg-white shadow-sm flex flex-col items-center text-center">
          <Typography variant="h5" className="font-extrabold text-brand-orange mb-3">
            Quick Actions
          </Typography>
          <Typography variant="body1" className="text-text-secondary leading-relaxed">
            Need to add a new task? Head over to the Schedule Management section to get started.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;

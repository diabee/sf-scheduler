import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
} from '@mui/material';
import { motion } from 'framer-motion';
import { getCacheFreeUrl } from '~/utils';
import heroBg from '~/assets/dashboard_hero.png';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <Box sx={{ pb: 4 }}>
      {/* Hero Welcome Banner */}
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          mb: 6,
          position: 'relative',
          height: { xs: 240, md: 280 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
          p: { xs: 4, md: 6 },
          overflow: 'hidden',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(135deg, rgba(255, 107, 0, 0.9) 0%, rgba(255, 140, 0, 0.7) 100%), url("${getCacheFreeUrl(heroBg)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            {t('dashboard.welcome', 'Welcome to SF Scheduler')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            {t('dashboard.subtitle', 'Smart scheduling for your enterprise activities.')}
          </Typography>
        </Box>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            Ready to Start
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Customize this page to display your scheduler overview and status.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;

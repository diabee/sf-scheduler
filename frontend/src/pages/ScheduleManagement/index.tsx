import { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageHeader from '~/components/PageHeader';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ConstructionImg from '~/assets/images/under_construction.png';

export default function ScheduleManagement() {
  const { t } = useTranslation();
  // Use a stable timestamp for the current session to avoid re-renders downloading multiple times
  const cacheBuster = useMemo(() => Date.now(), []);

  return (
    <Box>
      <PageHeader 
        title={t('nav.schedule', 'Schedule')}
      />
      
      <Grid container spacing={3}>
        {/* ... existing items ... */}
        <Grid item xs={12} md={4}>
          <Paper className="premium-card" sx={{ p: 3, textAlign: 'center' }}>
            <CalendarMonthIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>日曆視圖</Typography>
            <Typography variant="body2" color="text.secondary">
              查看所有已排定的任務時間表
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="premium-card" sx={{ p: 3, textAlign: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>即時狀態</Typography>
            <Typography variant="body2" color="text.secondary">
              監控正在執行中的自動化任務
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="premium-card" sx={{ p: 3, textAlign: 'center' }}>
            <ListAltIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>任務日誌</Typography>
            <Typography variant="body2" color="text.secondary">
              查看過去任務的執行紀錄與結果
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            className="premium-card" 
            sx={{ 
              p: 6, 
              minHeight: 500, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Box 
              component="img"
              src={`${ConstructionImg}?v=${cacheBuster}`}
              sx={{ 
                width: '100%', 
                maxWidth: 450, 
                mb: 4,
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))',
                animation: 'float 6s ease-in-out infinite'
              }}
              alt="Under Construction"
            />
            
            <Typography 
              variant="h4" 
              fontWeight={800} 
              color="primary" 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(45deg, #FF6B00 30%, #FFA500 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}
            >
              全新排程管理模組
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 1, opacity: 0.8, textAlign: 'center' }}
            >
              內容正在全力開發中，敬請期待
            </Typography>
            
            <Box 
              sx={{ 
                width: 60, 
                height: 4, 
                bgcolor: 'primary.main', 
                borderRadius: 2,
                mt: 2,
                opacity: 0.6
              }} 
            />

            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
              }
            `}} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, actions }: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 6,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {actions && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;

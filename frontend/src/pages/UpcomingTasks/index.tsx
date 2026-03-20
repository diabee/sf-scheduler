import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  TableSortLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import PageHeader from '~/components/PageHeader';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface UpcomingTask {
  id: string;
  taskName: string;
  nextRun: string;
  cron: string;
  executor: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'ENABLED' | 'PAUSED';
}

const mockTasks: UpcomingTask[] = [
  { id: '1', taskName: 'Database Vacuum', nextRun: '2026-03-19 23:00:00', cron: '0 0 23 * * ?', executor: 'System', priority: 'High', status: 'ENABLED' },
  { id: '2', taskName: 'Weekly Report Sync', nextRun: '2026-03-24 09:00:00', cron: '0 0 9 ? * TUE', executor: 'Admin', priority: 'Medium', status: 'ENABLED' },
  { id: '3', taskName: 'Temporary File Cleanup', nextRun: '2026-03-19 22:30:00', cron: '0 30 22 * * ?', executor: 'System', priority: 'Low', status: 'PAUSED' },
  { id: '4', taskName: 'S3 Asset Backup', nextRun: '2026-03-20 01:00:00', cron: '0 0 1 * * ?', executor: 'Admin', priority: 'High', status: 'ENABLED' },
  { id: '5', taskName: 'Re-index Search Engine', nextRun: '2026-03-20 03:00:00', cron: '0 0 3 * * ?', executor: 'System', priority: 'Medium', status: 'ENABLED' },
];

type Order = 'asc' | 'desc';

const getPriorityChip = (priority: UpcomingTask['priority']) => {
  const colors = {
    High: 'bg-red-50 text-red-600 border-red-200',
    Medium: 'bg-blue-50 text-blue-600 border-blue-200',
    Low: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

export default function UpcomingTasks() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof UpcomingTask>('nextRun');

  const handleRequestSort = (property: keyof UpcomingTask) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedTasks = useMemo(() => {
    const comparator = (a: UpcomingTask, b: UpcomingTask) => {
      if (b[orderBy] < a[orderBy]) return order === 'desc' ? -1 : 1;
      if (b[orderBy] > a[orderBy]) return order === 'desc' ? 1 : -1;
      return 0;
    };
    return [...mockTasks].sort(comparator);
  }, [order, orderBy]);

  const SortableHeader = ({ id, label, className }: { id: keyof UpcomingTask, label: string, className?: string }) => (
    <TableCell className={`font-extrabold text-text-primary ${className}`} sx={{ fontSize: '16px' }}>
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : 'asc'}
        onClick={() => handleRequestSort(id)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box className="flex flex-col gap-6">
      <PageHeader title={t('nav.upcomingTasks', '後續任務清單')} />

      {isMobile ? (
        <Box className="flex flex-col gap-4">
          <Paper className="p-3 rounded-xl border border-surface-border flex justify-between items-center bg-surface-secondary/30">
            <Typography variant="body2" className="text-text-secondary font-bold" sx={{ fontSize: '16px' }}>
              {t('common.sortBy', '排序依據')}: {t(`common.${orderBy}`, orderBy)}
            </Typography>
            <Box className="flex gap-2">
                <Chip 
                    label="Time" 
                    variant={orderBy === 'nextRun' ? 'filled' : 'outlined'} 
                    size="small" 
                    onClick={() => handleRequestSort('nextRun')}
                />
                <Chip 
                    label="Name" 
                    variant={orderBy === 'taskName' ? 'filled' : 'outlined'} 
                    size="small" 
                    onClick={() => handleRequestSort('taskName')}
                />
            </Box>
          </Paper>
          {sortedTasks.map((task) => (
            <Paper key={task.id} className="p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4 transition-all hover:border-brand-orange/30">
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="subtitle1" className="font-bold text-text-primary leading-tight" sx={{ fontSize: '16px' }}>
                    {task.taskName}
                  </Typography>
                  <Typography variant="caption" className="text-text-secondary font-mono" sx={{ fontSize: '14px' }}>
                    {task.cron}
                  </Typography>
                </Box>
                {getPriorityChip(task.priority)}
              </Box>

              <Box className="grid grid-cols-2 gap-y-3 text-sm py-2 border-y border-surface-border/50 border-dashed">
                <Box>
                  <Typography variant="caption" className="text-text-secondary block mb-0.5" sx={{ fontSize: '14px' }}>{t('common.nextRun', '下次執行時間')}</Typography>
                  <Typography variant="body2" className="font-semibold" sx={{ fontSize: '16px' }}>{task.nextRun}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-text-secondary block mb-0.5" sx={{ fontSize: '14px' }}>{t('common.executor', '執行者')}</Typography>
                  <Typography variant="body2" className="font-semibold" sx={{ fontSize: '16px' }}>{task.executor}</Typography>
                </Box>
              </Box>

              <Box className="flex justify-between items-center pt-1">
                <Chip 
                  label={task.status} 
                  size="small" 
                  className={`font-bold ${task.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                />
                <Box className="flex gap-2">
                  <IconButton size="small" className="text-brand-orange hover:bg-brand-orange/10"><PlayArrowIcon fontSize="small" /></IconButton>
                  <IconButton size="small" className="text-text-secondary hover:bg-slate-100"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" className="text-red-500 hover:bg-red-50"><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper className="premium-card rounded-2xl border border-surface-border overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-surface-secondary/30">
                  <SortableHeader id="taskName" label={t('common.title', '任務名稱')} className="pl-8" />
                  <SortableHeader id="cron" label={t('common.cron', 'Cron 設定')} />
                  <SortableHeader id="nextRun" label={t('common.nextRun', '下次執行')} />
                  <SortableHeader id="priority" label={t('common.priority', '優先級')} />
                  <TableCell className="font-extrabold text-text-primary" sx={{ fontSize: '16px' }}>{t('common.status', '狀態')}</TableCell>
                  <TableCell className="font-extrabold text-text-primary text-center pr-8" sx={{ fontSize: '16px' }}>{t('common.actions', '操作')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTasks.map((task) => (
                  <TableRow key={task.id} hover className="transition-all hover:bg-brand-orange/5 group">
                    <TableCell className="pl-8">
                       <Box className="flex items-center gap-3">
                         <Box className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                         <Typography className="font-bold text-text-primary" sx={{ fontSize: '16px' }}>{task.taskName}</Typography>
                       </Box>
                    </TableCell>
                    <TableCell><Typography className="font-mono text-sm text-text-secondary bg-slate-50 px-2 py-0.5 rounded inline-block" sx={{ fontSize: '14px' }}>{task.cron}</Typography></TableCell>
                    <TableCell className="text-text-secondary font-medium" sx={{ fontSize: '16px' }}>{task.nextRun}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{getPriorityChip(task.priority)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={task.status} 
                        size="small" 
                        className={`font-bold ${task.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                      />
                    </TableCell>
                    <TableCell className="text-center pr-8">
                      <Box className="flex justify-center gap-1">
                        <Tooltip title={t('common.runOnce', '立刻執行')}>
                          <IconButton size="small" className="text-brand-orange hover:bg-brand-orange/10"><PlayArrowIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.edit', '編輯')}>
                          <IconButton size="small" className="text-text-secondary hover:bg-slate-100"><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete', '刪除')}>
                          <IconButton size="small" className="text-red-500 hover:bg-red-50"><DeleteIcon /></IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

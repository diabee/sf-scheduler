import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  TablePagination, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '~/components/PageHeader';

interface LogEntry {
  id: string;
  taskName: string;
  startTime: string;
  duration: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  executor: string;
  request?: string;
  response?: string;
  errorMessage?: string;
}

const mockLogs: LogEntry[] = [
  { 
    id: '1', 
    taskName: 'Daily Database Backup', 
    startTime: '2026-03-19 10:00:00', 
    duration: '45s', 
    status: 'SUCCESS', 
    executor: 'System',
    request: '{"action": "backup", "target": "main_db", "compress": true}',
    response: '{"status": "completed", "file": "backup_20260319.sql.gz", "size": "1.2GB"}'
  },
  { 
    id: '2', 
    taskName: 'Mail Sync Task', 
    startTime: '2026-03-19 10:15:00', 
    duration: '12s', 
    status: 'SUCCESS', 
    executor: 'Admin',
    request: '{"sync_target": "office365", "batch_size": 100}',
    response: '{"processed_emails": 124, "errors": 0}'
  },
  { 
    id: '3', 
    taskName: 'Analytics Report Generation', 
    startTime: '2026-03-19 11:00:00', 
    duration: '3m 20s', 
    status: 'FAILED', 
    executor: 'System',
    request: '{"report_type": "monthly_sales", "format": "pdf"}',
    response: '{"error": "Timeout", "code": 504}',
    errorMessage: 'Connection to data warehouse timed out after 180 seconds.'
  },
  { id: '4', taskName: 'Cache Cleanup', startTime: '2026-03-19 12:00:00', duration: '-', status: 'RUNNING', executor: 'System', request: '{"flush_all": false, "keys": ["user_*"]}' },
  { id: '5', taskName: 'Elasticsearch Reindexing', startTime: '2026-03-19 13:00:00', duration: '15m', status: 'SUCCESS', executor: 'System', request: '{"index": "products", "full_reindex": true}', response: '{"indexed_documents": 245000}' },
  { id: '6', taskName: 'User Activity Archive', startTime: '2026-03-19 14:00:00', duration: '5m', status: 'SUCCESS', executor: 'Admin', request: '{"archive_date": "2026-02-19"}', response: '{"archived_rows": 15600}' },
];

type Order = 'asc' | 'desc';

const getStatusChip = (status: LogEntry['status']) => {
  switch (status) {
    case 'SUCCESS': return <Chip label={status} color="success" size="small" className="font-bold" />;
    case 'FAILED': return <Chip label={status} color="error" size="small" className="font-bold" />;
    case 'RUNNING': return <Chip label={status} color="primary" size="small" className="font-bold" />;
  }
};

export default function ScheduleLogs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof LogEntry>('startTime');
  
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleRequestSort = (property: keyof LogEntry) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLogs = useMemo(() => {
    const comparator = (a: LogEntry, b: LogEntry) => {
      if (b[orderBy]! < a[orderBy]!) return order === 'desc' ? -1 : 1;
      if (b[orderBy]! > a[orderBy]!) return order === 'desc' ? 1 : -1;
      return 0;
    };
    return [...mockLogs].sort(comparator);
  }, [order, orderBy]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetail = (log: LogEntry) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const paginatedLogs = sortedLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const SortableHeader = ({ id, label }: { id: keyof LogEntry, label: string }) => (
    <TableCell className="font-bold text-text-primary" sx={{ fontSize: '16px' }}>
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
      <PageHeader title={t('scheduleLogs.title', '排程日誌')} />
      
      {isMobile ? (
        <Box className="flex flex-col gap-4">
          <Paper className="p-3 rounded-xl border border-surface-border flex justify-between items-center bg-surface-secondary/30">
            <Typography variant="body2" className="text-text-secondary font-bold" sx={{ fontSize: '16px' }}>
              {t('common.sortBy', '排序依據')}: {t(`scheduleLogs.${orderBy}`, orderBy)}
            </Typography>
            <Box className="flex gap-2">
                <Chip 
                    label="Time" 
                    variant={orderBy === 'startTime' ? 'filled' : 'outlined'} 
                    size="small" 
                    onClick={() => handleRequestSort('startTime')}
                />
                <Chip 
                    label="Name" 
                    variant={orderBy === 'taskName' ? 'filled' : 'outlined'} 
                    size="small" 
                    onClick={() => handleRequestSort('taskName')}
                />
            </Box>
          </Paper>
          {paginatedLogs.map((log) => (
            <Paper 
              key={log.id} 
              className="p-4 rounded-xl border border-surface-border shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => handleOpenDetail(log)}
            >
              <Box className="flex justify-between items-start mb-3">
                <Typography variant="subtitle1" className="font-bold text-text-primary" sx={{ fontSize: '16px' }}>
                  {log.taskName}
                </Typography>
                {getStatusChip(log.status)}
              </Box>
              <Box className="grid grid-cols-2 gap-y-2 text-sm">
                <Typography variant="body2" className="text-text-secondary" sx={{ fontSize: '16px' }}>{t('scheduleLogs.startTime', '開始時間')}</Typography>
                <Typography variant="body2" className="text-text-primary font-medium" sx={{ fontSize: '16px' }}>{log.startTime}</Typography>
                <Typography variant="body2" className="text-text-secondary" sx={{ fontSize: '16px' }}>{t('scheduleLogs.duration', '持續時間')}</Typography>
                <Typography variant="body2" className="text-text-primary font-medium" sx={{ fontSize: '16px' }}>{log.duration}</Typography>
                <Typography variant="body2" className="text-text-secondary" sx={{ fontSize: '16px' }}>{t('scheduleLogs.executor', '執行者')}</Typography>
                <Typography variant="body2" className="text-text-primary font-medium" sx={{ fontSize: '16px' }}>{log.executor}</Typography>
              </Box>
            </Paper>
          ))}
          <Paper className="p-2 rounded-xl border border-surface-border">
            <TablePagination
              component="div"
              count={mockLogs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage=""
            />
          </Paper>
        </Box>
      ) : (
        <Paper className="premium-card rounded-2xl border border-surface-border overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-surface-secondary/50">
                  <SortableHeader id="taskName" label={t('scheduleLogs.taskName', '任務名稱')} />
                  <SortableHeader id="startTime" label={t('scheduleLogs.startTime', '開始時間')} />
                  <SortableHeader id="duration" label={t('scheduleLogs.duration', '持續時間')} />
                  <SortableHeader id="executor" label={t('scheduleLogs.executor', '執行者')} />
                  <TableCell className="font-bold text-text-primary" sx={{ fontSize: '16px' }}>{t('scheduleLogs.status', '狀態')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    hover 
                    className="transition-colors hover:bg-brand-orange/5 cursor-pointer"
                    onClick={() => handleOpenDetail(log)}
                  >
                    <TableCell className="font-medium" sx={{ fontSize: '16px' }}>{log.taskName}</TableCell>
                    <TableCell className="text-text-secondary" sx={{ fontSize: '16px' }}>{log.startTime}</TableCell>
                    <TableCell className="text-text-secondary" sx={{ fontSize: '16px' }}>{log.duration}</TableCell>
                    <TableCell className="text-text-secondary" sx={{ fontSize: '16px' }}>{log.executor}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{getStatusChip(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={mockLogs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            className="border-t border-surface-border"
          />
        </Paper>
      )}

      <Dialog 
        open={detailOpen} 
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-2xl",
          sx: { p: 1 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box className="flex justify-between items-center">
            <Typography variant="h6" className="font-bold text-text-primary">
              {t('scheduleLogs.detailTitle', '日誌詳情')}
            </Typography>
            {selectedLog && getStatusChip(selectedLog.status)}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box className="flex flex-col gap-6 py-2">
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" className="text-text-secondary block mb-0.5">{t('scheduleLogs.taskName', '任務名稱')}</Typography>
                  <Typography variant="body1" className="font-bold">{selectedLog.taskName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-text-secondary block mb-0.5">{t('scheduleLogs.startTime', '開始時間')}</Typography>
                  <Typography variant="body1" className="font-semibold">{selectedLog.startTime}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" className="font-bold mb-2 flex items-center gap-2">
                  <Box className="w-1.5 h-4 bg-brand-orange rounded-full" />
                  {t('scheduleLogs.requestData', '請求內容 (Request)')}
                </Typography>
                <Paper className="p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
                  <pre className="font-mono text-xs whitespace-pre-wrap text-slate-700">
                    {selectedLog.request || t('common.noData', '無資料')}
                  </pre>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" className="font-bold mb-2 flex items-center gap-2">
                  <Box className="w-1.5 h-4 bg-green-500 rounded-full" />
                  {t('scheduleLogs.responseData', '回應內容 (Response)')}
                </Typography>
                <Paper className="p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
                  <pre className="font-mono text-xs whitespace-pre-wrap text-slate-700">
                    {selectedLog.response || t('common.noData', '無資料')}
                  </pre>
                </Paper>
              </Box>

              {selectedLog.errorMessage && (
                <Box>
                  <Typography variant="subtitle2" className="font-bold mb-2 text-red-600 flex items-center gap-2">
                    <Box className="w-1.5 h-4 bg-red-500 rounded-full" />
                    {t('scheduleLogs.errorMessage', '錯誤訊息')}
                  </Typography>
                  <Paper className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <Typography variant="body2" className="text-red-700 font-medium">
                      {selectedLog.errorMessage}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseDetail} variant="outlined" className="rounded-xl px-6">
            {t('common.close', '關閉')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

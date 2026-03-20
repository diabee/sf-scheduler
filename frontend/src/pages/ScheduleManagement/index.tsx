import { 
  Box, 
  Paper, 
  useMediaQuery, 
  useTheme, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Typography, 
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '~/components/PageHeader';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  description?: string;
  executor?: string;
}

const initialEvents: ScheduleEvent[] = [
  { id: '1', title: 'Daily Backup', start: '2026-03-19T10:00:00', end: '2026-03-19T11:00:00', backgroundColor: '#FF6B00', borderColor: '#FF6B00', description: 'System wide backup', executor: 'System' },
  { id: '2', title: 'Analytics Sync', start: '2026-03-20T14:30:00', end: '2026-03-20T16:00:00', backgroundColor: '#0078D4', borderColor: '#0078D4', description: 'Deep dive analytics', executor: 'Admin' },
  { id: '3', title: 'Cache Cleanup', start: '2026-03-21T02:00:00', end: '2026-03-21T03:00:00', backgroundColor: '#107C10', borderColor: '#107C10', description: 'Redis cache clear', executor: 'System' },
  { id: '4', title: 'Log Rotation', start: '2026-03-19T23:00:00', end: '2026-03-20T00:00:00', backgroundColor: '#E81123', borderColor: '#E81123', description: 'Move old logs', executor: 'System' },
];

export default function ScheduleManagement() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef<FullCalendar>(null);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleOpenAdd = () => {
    setSelectedEvent({
      id: '',
      title: '',
      start: new Date().toISOString().slice(0, 16),
      end: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      backgroundColor: '#FF6B00',
      borderColor: '#FF6B00',
      description: '',
      executor: 'Admin'
    });
    setIsEdit(true);
    setOpen(true);
  };

  const handleEventClick = (info: any) => {
    const event = initialEvents.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsEdit(false);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const jumpToDate = (year: number, month: number) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
        const date = new Date(year, month, 1);
        calendarApi.gotoDate(date);
    }
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    jumpToDate(year, currentMonth);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    jumpToDate(currentYear, month);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader title={t('nav.schedule', '排程管理')} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all duration-200"
          sx={{ textTransform: 'none', fontSize: '16px' }}
        >
          {t('common.addSchedule', '新增排程')}
        </Button>
      </Box>

      <Paper className="premium-card p-4 md:p-6 rounded-2xl shadow-sm border border-surface-border overflow-hidden">
        <Box className="mb-6 flex flex-wrap items-center gap-3">
            <Typography variant="body2" className="text-text-secondary font-bold mr-2">
                {t('common.jumpTo', '跳轉至')}:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                    value={currentYear}
                    onChange={(e) => handleYearChange(e.target.value as number)}
                    sx={{ borderRadius: '10px' }}
                >
                    {years.map(y => (
                        <MenuItem key={y} value={y}>{y}{t('common.year', '年')}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                    value={currentMonth}
                    onChange={(e) => handleMonthChange(e.target.value as number)}
                    sx={{ borderRadius: '10px' }}
                >
                    {months.map(m => (
                        <MenuItem key={m} value={m}>{m + 1}{t('common.month', '月')}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
          buttonText={{
            today: t('common.today', '今日'),
            month: t('common.month', '月'),
            week: t('common.week', '週'),
            day: t('common.day', '日'),
            list: t('common.list', '清單')
          }}
          headerToolbar={isMobile ? {
            left: 'prev,next',
            center: 'title',
            right: 'timeGridDay,listWeek'
          } : {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          events={initialEvents}
          height="auto"
          eventClick={handleEventClick}
          locale="zh-tw"
          datesSet={(arg) => {
              const date = arg.view.currentStart;
              setCurrentYear(date.getFullYear());
              setCurrentMonth(date.getMonth());
          }}
        />
      </Paper>

      {/* RWD Interactive Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-2xl shadow-2xl"
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b border-surface-border p-4 md:p-6">
          <Typography variant="h6" className="font-bold text-text-primary">
            {isEdit ? (selectedEvent?.id ? t('common.editSchedule', '編輯排程') : t('common.addSchedule', '新增排程')) : t('common.viewSchedule', '排程詳情')}
          </Typography>
          <IconButton onClick={handleClose} size="small" className="text-text-secondary hover:text-brand-orange">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-4 md:p-8">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <TextField
              label={t('common.title', '標題')}
              fullWidth
              variant="outlined"
              disabled={!isEdit}
              defaultValue={selectedEvent?.title}
              className="col-span-1 md:col-span-2"
              InputProps={{ className: "rounded-xl" }}
            />
            <TextField
              label={t('common.startTime', '開始時間')}
              type="datetime-local"
              fullWidth
              variant="outlined"
              disabled={!isEdit}
              defaultValue={selectedEvent?.start?.slice(0, 16)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ className: "rounded-xl" }}
            />
            <TextField
              label={t('common.endTime', '結束時間')}
              type="datetime-local"
              fullWidth
              variant="outlined"
              disabled={!isEdit}
              defaultValue={selectedEvent?.end?.slice(0, 16)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ className: "rounded-xl" }}
            />
            <FormControl fullWidth variant="outlined" disabled={!isEdit}>
              <InputLabel>{t('common.executor', '執行者')}</InputLabel>
              <Select
                defaultValue={selectedEvent?.executor || 'Admin'}
                label={t('common.executor', '執行者')}
                classes={{ root: "rounded-xl" }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="System">System</MenuItem>
              </Select>
            </FormControl>
            <Box>
                <Typography variant="caption" className="text-text-secondary block mb-1 ml-1">{t('common.themeColor', '主題顏色')}</Typography>
                <Box className="flex gap-2">
                    {['#FF6B00', '#0078D4', '#107C10', '#E81123'].map(color => (
                        <Box 
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${selectedEvent?.backgroundColor === color ? 'ring-2 ring-offset-2 ring-brand-orange scale-110' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => isEdit && setSelectedEvent(prev => prev ? {...prev, backgroundColor: color, borderColor: color} : null)}
                        />
                    ))}
                </Box>
            </Box>
            <TextField
              label={t('common.description', '備註內容')}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              disabled={!isEdit}
              defaultValue={selectedEvent?.description}
              className="col-span-1 md:col-span-2"
              InputProps={{ className: "rounded-xl" }}
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4 md:p-6 border-t border-surface-border bg-surface-secondary">
          <Button onClick={handleClose} className="text-text-secondary font-semibold rounded-xl px-6">
            {t('common.close', '關閉')}
          </Button>
          {!isEdit ? (
            <Button 
                onClick={handleToggleEdit}
                variant="contained" 
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-xl px-8 shadow-md"
            >
              {t('common.edit', '編輯')}
            </Button>
          ) : (
            <Button 
                onClick={handleClose} 
                variant="contained" 
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold rounded-xl px-8 shadow-md"
            >
              {t('common.save', '儲存')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .fc {
          font-family: inherit;
        }
        .fc .fc-toolbar-title {
          font-size: ${isMobile ? '1.1rem' : '1.5rem'};
          font-weight: 800;
          color: #1a1a1a;
        }
        .fc .fc-button-primary {
          background-color: #f8faff;
          border: 1px solid rgba(255, 107, 0, 0.15);
          color: #FF6B00;
          font-weight: 700;
          padding: ${isMobile ? '6px 10px' : '10px 20px'};
          font-size: ${isMobile ? '0.75rem' : '0.9rem'};
          border-radius: 12px;
          transition: all 0.2s;
        }
        .fc .fc-button-primary:not(:disabled):hover {
          background-color: #fff;
          border-color: #FF6B00;
          color: #e06000;
          box-shadow: 0 4px 12px rgba(255,107,0,0.1);
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #FF6B00;
          border-color: #FF6B00;
          color: #fff;
          box-shadow: 0 4px 12px rgba(255,107,0,0.25);
        }
        .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(255, 107, 0, 0.04);
        }
        .fc .fc-event {
          border-radius: 8px;
          padding: 4px 8px;
          margin: 2px 0;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-weight: 600;
          font-size: 0.85rem;
          transition: transform 0.1s;
        }
        .fc .fc-event:hover {
          transform: scale(1.02);
        }
        .fc-toolbar {
          margin-bottom: 2rem !important;
          flex-direction: ${isMobile ? 'column' : 'row'};
          gap: 1.5rem;
        }
      `}} />
    </Box>
  );
}

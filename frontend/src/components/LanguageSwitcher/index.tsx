import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
];

function LanguageSwitcher({ color = 'action' }: { color?: string }) {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  // 取得正規化的語言代碼 (處理 'zh-TW-u-...' 等變體)
  const getCurrentLanguage = () => {
    const lang = i18n.language;
    if (lang.startsWith('zh')) return 'zh-TW';
    if (lang.startsWith('en')) return 'en';
    return 'zh-TW';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <LanguageIcon fontSize="small" sx={{ color: color === 'white' ? 'white' : 'inherit' }} color={color as any} />
      <Select
        size="small"
        value={getCurrentLanguage()}
        onChange={handleChange}
        variant="standard"
        disableUnderline
        sx={{ 
          minWidth: 100, 
          fontSize: '16px',
          color: color === 'white' ? 'white' : 'inherit',
          '& .MuiSelect-icon': { color: color === 'white' ? 'white' : 'inherit' }
        }}
      >
        {languages.map(lang => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default LanguageSwitcher;

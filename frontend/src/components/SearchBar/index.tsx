import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  fullWidth?: boolean;
}

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder, 
  onSearch,
  fullWidth = true 
}: SearchBarProps) => {
  return (
    <TextField
      fullWidth={fullWidth}
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && onSearch) {
          onSearch();
        }
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
        }
      }}
    />
  );
};

export default SearchBar;

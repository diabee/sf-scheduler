import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { apiService } from '~/services/api';
import type { UserDTO, UpdateProfileRequest } from '~/types';

interface ProfileProps {
  onClose: () => void;
  onProfileUpdated: (user: UserDTO) => void;
}

function Profile({ onClose, onProfileUpdated }: ProfileProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<UserDTO | null>(null);

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    email: '',
    name: '',
    department: '',
    memo: '',
    extension: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setUser(userData);
        setFormData({
          email: userData.email,
          name: userData.name || '',
          department: userData.department || '',
          memo: userData.memo || '',
          extension: userData.extension || '',
          password: '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(t('profile.loadError'));
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [t]);

  const handleChange = (field: keyof UpdateProfileRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== confirmPassword) {
      setError(t('profile.passwordMismatch'));
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setError(t('profile.passwordTooShort'));
      return;
    }

    setSaving(true);
    try {
      const updateData: UpdateProfileRequest = {
        email: formData.email,
        name: formData.name,
        department: formData.department,
        memo: formData.memo,
        extension: formData.extension,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await apiService.updateProfile(updateData);
      setUser(updatedUser);
      onProfileUpdated(updatedUser);
      setSuccess(t('profile.updateSuccess'));
      setFormData(prev => ({ ...prev, password: '' }));
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorResponse = err as { response?: { data?: { message?: string; detail?: string; errors?: Record<string, string> } } };
      const errorData = errorResponse?.response?.data;
      
      if (errorData?.errors) {
        // Show field-specific errors
        const fieldErrors = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        setError(fieldErrors);
      } else if (errorData?.detail) {
        setError(errorData.detail);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError(t('profile.updateError'));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {t('profile.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user?.username}
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            {t('profile.basicInfo')}
          </Typography>

          <TextField
            fullWidth
            label={t('profile.email')}
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            margin="normal"
            required
            autoComplete="off"
          />

          <TextField
            fullWidth
            label={t('profile.name')}
            value={formData.name}
            onChange={handleChange('name')}
            margin="normal"
            autoComplete="off"
          />

          <TextField
            fullWidth
            label={t('profile.department')}
            value={formData.department}
            onChange={handleChange('department')}
            margin="normal"
            autoComplete="off"
          />

          <TextField
            fullWidth
            label={t('profile.extension')}
            value={formData.extension}
            onChange={handleChange('extension')}
            margin="normal"
            autoComplete="off"
          />

          <TextField
            fullWidth
            label={t('profile.memo')}
            value={formData.memo}
            onChange={handleChange('memo')}
            margin="normal"
            multiline
            rows={2}
            autoComplete="off"
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            {t('profile.changePassword')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('profile.passwordHint')}
          </Typography>

          <TextField
            fullWidth
            label={t('profile.newPassword')}
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            margin="normal"
            helperText={t('profile.passwordMinLength')}
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label={t('profile.confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            margin="normal"
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onClose} fullWidth>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              fullWidth
            >
              {saving ? <CircularProgress size={24} /> : t('common.save')}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Profile;

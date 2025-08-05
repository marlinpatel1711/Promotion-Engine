import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  FormHelperText,
  Box,
  Paper,
  Divider,
  Grid,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
// Using regular date inputs instead of MUI date pickers to avoid dependency issues
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { usePromotionContext } from '../context/PromotionContext';
import RuleBuilder from '../components/RuleBuilder';
import type { Promotion, PromotionRule, PromotionType, PromotionApplicability, PromotionCondition } from '../types/promotion';

const currencies = [
  { code: 'USD', label: 'United States Dollar - USD', symbol: '$' },
  { code: 'EUR', label: 'Euro - EUR', symbol: '€' },
  { code: 'INR', label: 'Indian Rupee - INR', symbol: '₹' },
  { code: 'GBP', label: 'British Pound - GBP', symbol: '£' },
];

const timezones = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney',
];

const promotionTypes = [
  { value: 'percentage', label: 'Percentage Discount' },
  { value: 'fixed', label: 'Fixed Amount Discount' },
  { value: 'bogo', label: 'Buy One Get One' },
  { value: 'custom', label: 'Custom Promotion' },
];

const applicabilityOptions = [
  { value: 'cart', label: 'Entire Cart' },
  { value: 'product', label: 'Specific Products' },
  { value: 'category', label: 'Product Categories' },
];

type PromotionFormPageProps = {
  open?: boolean;
  onClose?: () => void;
  standalone?: boolean;
};

const defaultValues: Partial<Promotion> = {
  id: '',
  name: '',
  description: '',
  type: 'percentage' as PromotionType,
  value: 10,
  applicability: 'cart' as PromotionApplicability,
  conditions: {
    minCartValue: 0,
  },
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  stackable: true,
  priority: 1,
  isActive: true,
  clientId: '1',
  tags: [],
};

const PromotionFormPage = ({ open = true, onClose, standalone = false }: PromotionFormPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promotions, createPromotion, updatePromotion, loading } = usePromotionContext();
  
  const [values, setValues] = useState<Partial<Promotion>>({ ...defaultValues });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [rules, setRules] = useState<PromotionRule[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    if (id) {
      setMode('edit');
      const promotion = promotions.find(p => p.id === id);
      if (promotion) {
        setValues({ ...promotion });
      }
    } else {
      setMode('create');
      setValues({ ...defaultValues });
    }
  }, [id, promotions]);

  const handleChange = (field: keyof Promotion, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRulesChange = (newRules: PromotionRule[]) => {
    setRules(newRules);
  };

  const handleTagDelete = (tagToDelete: string) => {
    const newTags = values.tags?.filter(tag => tag !== tagToDelete) || [];
    handleChange('tags', newTags);
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      const newTag = event.currentTarget.value.trim();
      if (newTag && (!values.tags || !values.tags.includes(newTag))) {
        const newTags = [...(values.tags || []), newTag];
        handleChange('tags', newTags);
        event.currentTarget.value = '';
      }
    }
  };

  const validate = () => {
    return {
      name: !values.name,
      type: !values.type,
      value: values.value === undefined || values.value === null,
      applicability: !values.applicability,
      startDate: !values.startDate,
      endDate: !values.endDate,
      clientId: !values.clientId,
    };
  };
  
  const errors = validate();
  const hasError = Object.values(errors).some(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasError) {
      try {
        const promotionData = {
          ...values,
        } as Promotion;

        if (mode === 'create') {
          await createPromotion(promotionData);
          setSnackbar({ open: true, message: 'Promotion created successfully!', severity: 'success' });
        } else {
          await updatePromotion(promotionData.id, promotionData);
          setSnackbar({ open: true, message: 'Promotion updated successfully!', severity: 'success' });
        }

        if (standalone) {
          setTimeout(() => {
            navigate('/promotions');
          }, 1500);
        } else if (onClose) {
          onClose();
        }
      } catch (error) {
        setSnackbar({ open: true, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (standalone) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/promotions')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5">
                {mode === 'create' ? 'Create New Promotion' : 'Edit Promotion'}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={hasError || loading}
            >
              {loading ? <CircularProgress size={24} /> : (mode === 'create' ? 'Create' : 'Update')}
            </Button>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee' }}>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Promotion Name"
                        value={values.name || ''}
                        onChange={e => handleChange('name', e.target.value)}
                        required
                        fullWidth
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name ? 'Name is required' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Description"
                        value={values.description || ''}
                        onChange={e => handleChange('description', e.target.value)}
                        fullWidth
                        multiline
                        rows={1}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required error={touched.type && errors.type}>
                        <InputLabel>Promotion Type</InputLabel>
                        <Select
                          label="Promotion Type"
                          value={values.type || ''}
                          onChange={e => handleChange('type', e.target.value)}
                        >
                          {promotionTypes.map(type => (
                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                          ))}
                        </Select>
                        {touched.type && errors.type && <FormHelperText>Promotion type is required</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={`Value ${values.type === 'percentage' ? '(%)' : '(Amount)'}`}
                        type="number"
                        value={values.value || ''}
                        onChange={e => handleChange('value', Number(e.target.value))}
                        required
                        fullWidth
                        error={touched.value && errors.value}
                        helperText={touched.value && errors.value ? 'Value is required' : ''}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Applicability */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee' }}>
                  <Typography variant="h6" gutterBottom>Applicability</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required error={touched.applicability && errors.applicability}>
                        <InputLabel>Apply To</InputLabel>
                        <Select
                          label="Apply To"
                          value={values.applicability || ''}
                          onChange={e => handleChange('applicability', e.target.value)}
                        >
                          {applicabilityOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </Select>
                        {touched.applicability && errors.applicability && <FormHelperText>Required</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Start Date"
                        type="date"
                        value={values.startDate ? new Date(values.startDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleChange('startDate', new Date(e.target.value).toISOString())}
                        fullWidth
                        required
                        error={touched.startDate && errors.startDate}
                        helperText={touched.startDate && errors.startDate ? 'Start date is required' : ''}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="End Date"
                        type="date"
                        value={values.endDate ? new Date(values.endDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleChange('endDate', new Date(e.target.value).toISOString())}
                        fullWidth
                        required
                        error={touched.endDate && errors.endDate}
                        helperText={touched.endDate && errors.endDate ? 'End date is required' : ''}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Advanced Settings */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Advanced Settings</Typography>
                    <Tooltip title="Configure additional promotion settings">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Stackable</InputLabel>
                        <Select
                          label="Stackable"
                          value={values.stackable ? 'true' : 'false'}
                          onChange={e => handleChange('stackable', e.target.value === 'true')}
                        >
                          <MenuItem value="true">Yes - Can combine with other promotions</MenuItem>
                          <MenuItem value="false">No - Exclusive promotion</MenuItem>
                        </Select>
                        <FormHelperText>Determines if this promotion can be combined with others</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Priority"
                        type="number"
                        value={values.priority || 1}
                        onChange={e => handleChange('priority', Number(e.target.value))}
                        fullWidth
                        helperText="Lower numbers have higher priority"
                        InputProps={{ inputProps: { min: 1, max: 100 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label="Status"
                          value={values.isActive ? 'true' : 'false'}
                          onChange={e => handleChange('isActive', e.target.value === 'true')}
                        >
                          <MenuItem value="true">Active</MenuItem>
                          <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required error={touched.clientId && errors.clientId}>
                        <InputLabel>Client</InputLabel>
                        <Select
                          label="Client"
                          value={values.clientId || ''}
                          onChange={e => handleChange('clientId', e.target.value)}
                        >
                          <MenuItem value="1">Fashion Store</MenuItem>
                          <MenuItem value="2">Electronics Mart</MenuItem>
                          <MenuItem value="3">Grocery World</MenuItem>
                        </Select>
                        {touched.clientId && errors.clientId && <FormHelperText>Client is required</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Tags"
                        placeholder="Type and press Enter to add tags"
                        fullWidth
                        onKeyDown={handleTagAdd}
                        helperText="Add tags to categorize this promotion"
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {values.tags?.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleTagDelete(tag)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Rules Builder */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee' }}>
                  <RuleBuilder onChange={handleRulesChange} initialRules={rules} />
                </Paper>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{mode === 'create' ? 'Create New Promotion' : 'Edit Promotion'}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Promotion Name"
                value={values.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                required
                fullWidth
                error={touched.name && errors.name}
                helperText={touched.name && errors.name ? 'Name is required' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                value={values.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={touched.type && errors.type}>
                <InputLabel>Promotion Type</InputLabel>
                <Select
                  label="Promotion Type"
                  value={values.type || ''}
                  onChange={e => handleChange('type', e.target.value)}
                >
                  {promotionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
                {touched.type && errors.type && <FormHelperText>Promotion type is required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={`Value ${values.type === 'percentage' ? '(%)' : '(Amount)'}`}
                type="number"
                value={values.value || ''}
                onChange={e => handleChange('value', Number(e.target.value))}
                required
                fullWidth
                error={touched.value && errors.value}
                helperText={touched.value && errors.value ? 'Value is required' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={touched.applicability && errors.applicability}>
                <InputLabel>Apply To</InputLabel>
                <Select
                  label="Apply To"
                  value={values.applicability || ''}
                  onChange={e => handleChange('applicability', e.target.value)}
                >
                  {applicabilityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
                {touched.applicability && errors.applicability && <FormHelperText>Required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={values.isActive ? 'true' : 'false'}
                  onChange={e => handleChange('isActive', e.target.value === 'true')}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <RuleBuilder onChange={handleRulesChange} initialRules={rules} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={hasError || loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}
          </Button>
        </DialogActions>
      </form>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default PromotionFormPage;
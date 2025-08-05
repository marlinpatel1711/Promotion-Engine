import { Box, Typography, Paper, Stack, TextField, Switch, FormControlLabel, Button } from '@mui/material';
import { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    defaultCurrency: 'USD',
    apiKey: 'sk_test_123456',
  });

  const handleChange = (field: string, value: unknown) => setSettings(s => ({ ...s, [field]: value }));

  return (
    <Box>
      <Typography variant="h4" mb={2}>Settings</Typography>
      <Paper sx={{ p: 2, maxWidth: 500 }}>
        <Stack spacing={3}>
          <FormControlLabel
            control={<Switch checked={settings.notifications} onChange={e => handleChange('notifications', e.target.checked)} />}
            label="Enable notifications"
          />
          <TextField
            label="Default Currency"
            value={settings.defaultCurrency}
            onChange={e => handleChange('defaultCurrency', e.target.value)}
          />
          <TextField
            label="API Key"
            value={settings.apiKey}
            onChange={e => handleChange('apiKey', e.target.value)}
            helperText="Used for external integrations"
          />
          <Button variant="contained">Save Settings</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SettingsPage; 
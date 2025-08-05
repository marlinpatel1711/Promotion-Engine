import { useState } from 'react';
import { Box, Typography, Paper, Button, Stack, TextField, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from '@mui/material';

const initialCoupons = [
  { code: '20pizza', unlimited: true, perCustomer: 1, start: '2025-08-01', end: '2025-12-31' },
  { code: 'FESTIVE100', unlimited: false, perCustomer: 2, start: '2025-10-01', end: '2025-10-31' },
];

const CouponsPage = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({ code: '', unlimited: true, perCustomer: 1, start: '', end: '' });

  const handleChange = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));
  const handleAdd = () => {
    setCoupons([...coupons, form]);
    setForm({ code: '', unlimited: true, perCustomer: 1, start: '', end: '' });
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Coupons</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Create a universal code</Typography>
        <Stack direction="row" spacing={2} alignItems="center" mt={2}>
          <TextField label="Coupon code" value={form.code} onChange={e => handleChange('code', e.target.value)} />
          <Checkbox checked={form.unlimited} onChange={e => handleChange('unlimited', e.target.checked)} />
          <Typography>Allow unlimited redemptions</Typography>
          <TextField label="Per-customer redemption limit" type="number" value={form.perCustomer} onChange={e => handleChange('perCustomer', Number(e.target.value))} sx={{ width: 180 }} />
          <TextField label="Start date" type="date" value={form.start} onChange={e => handleChange('start', e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Expiry date" type="date" value={form.end} onChange={e => handleChange('end', e.target.value)} InputLabelProps={{ shrink: true }} />
          <Button variant="contained" onClick={handleAdd} disabled={!form.code}>Create</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>All Coupons</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Unlimited</TableCell>
              <TableCell>Per Customer</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((c, i) => (
              <TableRow key={i}>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.unlimited ? 'Yes' : 'No'}</TableCell>
                <TableCell>{c.perCustomer}</TableCell>
                <TableCell>{c.start}</TableCell>
                <TableCell>{c.end}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CouponsPage; 
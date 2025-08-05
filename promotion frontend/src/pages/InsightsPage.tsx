import { Box, Typography, Paper, Grid } from '@mui/material';

const InsightsPage = () => {
  // Demo stats
  const stats = [
    { label: 'Total Redemptions', value: 1200 },
    { label: 'Unique Users', value: 350 },
    { label: 'Top Coupon', value: '20pizza' },
    { label: 'Most Used Promotion', value: 'SUMMER10' },
    { label: 'Avg. Discount per Order', value: '₹150' },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2}>Insights</Typography>
      <Grid container spacing={2}>
        {stats.map((s, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{s.label}</Typography>
              <Typography variant="h3" color="primary.main">{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" mb={2}>Usage Trends (Demo)</Typography>
        <Typography color="text.secondary">[Charts and graphs can be added here using a chart library like recharts or chart.js]</Typography>
      </Paper>
    </Box>
  );
};

export default InsightsPage; 
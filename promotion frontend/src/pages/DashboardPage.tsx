import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Dialog, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePromotionContext } from '../context/PromotionContext';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import PromotionFormPage from './PromotionFormPage';

const DashboardPage = () => {
  const { promotions, appliedPromotions, fetchPromotions, createPromotion, updatePromotion } = usePromotionContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editData, setEditData] = useState<unknown | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const activePromos = promotions.filter(p => new Date(p.endDate) > new Date());
  const expiredPromos = promotions.filter(p => new Date(p.endDate) <= new Date());
  
  // Calculate statistics
  const totalDiscountAmount = appliedPromotions.reduce((sum, ap) => sum + ap.finalDiscountAmount, 0);
  const avgDiscountAmount = appliedPromotions.length > 0 ? totalDiscountAmount / appliedPromotions.length : 0;
  
  // Get promotion types distribution
  const promoTypeCount = promotions.reduce((acc: Record<string, number>, promo) => {
    acc[promo.type] = (acc[promo.type] || 0) + 1;
    return acc;
  }, {});

  const handleAdd = () => {
    setModalMode('create');
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (promo: unknown) => {
    setModalMode('edit');
    setEditData(promo);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleModalSubmit = async (data: unknown) => {
    try {
      if (modalMode === 'create') {
        await createPromotion(data as any);
      } else if (modalMode === 'edit' && editData) {
        await updatePromotion((editData as any).id, data as any);
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to save promotion:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAdd}
          sx={{ borderRadius: 2 }}
        >
          New Promotion
        </Button>
      </Box>

      {/* {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : ( */}
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Active Promotions</Typography>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>{activePromos.length}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      size="small" 
                      label={`${Math.round((activePromos.length / (promotions.length || 1)) * 100)}%`} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>of total</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Expired Promotions</Typography>
                  <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 'bold' }}>{expiredPromos.length}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      size="small" 
                      label={`${Math.round((expiredPromos.length / (promotions.length || 1)) * 100)}%`} 
                      color="default" 
                      variant="outlined" 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>of total</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Promotions</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{promotions.length}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {promotions.length > 0 ? 'Across all clients' : 'No promotions yet'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Avg. Discount</Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    ₹{avgDiscountAmount.toFixed(0)}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {appliedPromotions.length} applications
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Promotions */}
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
                <CardHeader 
                  title="Recent Promotions" 
                  action={
                    <Button size="small" onClick={() => navigate('/promotions')}>
                      View All
                    </Button>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {promotions.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">No promotions found.</Typography>
                      <Button 
                        variant="outlined" 
                        startIcon={<AddIcon />} 
                        onClick={handleAdd} 
                        sx={{ mt: 2 }}
                      >
                        Create Your First Promotion
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {promotions.slice(0, 5).map((promo, index) => {
                        const isActive = new Date(promo.endDate) > new Date();
                        return (
                          <React.Fragment key={promo.id}>
                            {index > 0 && <Divider variant="inset" component="li" />}
                            <ListItem
                              secondaryAction={
                                <Button size="small" onClick={() => handleEdit(promo)}>
                                  Edit
                                </Button>
                              }
                            >
                              <ListItemIcon>
                                <LocalOfferIcon color={isActive ? 'primary' : 'disabled'} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle2">{promo.name || promo.id}</Typography>
                                    {isActive ? (
                                      <Chip 
                                        size="small" 
                                        label="Active" 
                                        color="success" 
                                        variant="outlined"
                                        icon={<CheckCircleIcon fontSize="small" />}
                                        sx={{ ml: 1, height: 20 }} 
                                      />
                                    ) : (
                                      <Chip 
                                        size="small" 
                                        label="Expired" 
                                        color="default" 
                                        variant="outlined"
                                        icon={<CancelIcon fontSize="small" />}
                                        sx={{ ml: 1, height: 20 }} 
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      {promo.type.charAt(0).toUpperCase() + promo.type.slice(1)} • 
                                      {promo.value}{promo.type === 'percentage' ? '%' : ''} • 
                                      Valid until {new Date(promo.endDate).toLocaleDateString()}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </React.Fragment>
                        );
                      })}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Promotion Stats */}
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
                <CardHeader title="Promotion Insights" />
                <Divider />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total Discount Amount" 
                        secondary={`₹${totalDiscountAmount.toLocaleString()}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PieChartIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Promotion Types">
                      </ListItemText>
                    </ListItem>
                  </List>
                  <Box sx={{ pl: 9 }}>
                    {Object.entries(promoTypeCount).map(([type, count]) => (
                      <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {count} ({Math.round((count / promotions.length) * 100)}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      {/* )} */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
        <PromotionFormPage
          open={modalOpen}
          onClose={handleModalClose}
          standalone={true}
        />
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  TablePagination
} from '@mui/material';
import { usePromotionContext } from '../context/PromotionContext';
import PromotionFormPage from './PromotionFormPage';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Promotion } from '../types/promotion';

const PromotionListPage = () => {
  const { promotions, loading, fetchPromotions, createPromotion, updatePromotion, deletePromotion } = usePromotionContext();
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editData, setEditData] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleAdd = () => {
    setModalMode('create');
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setModalMode('edit');
    setEditData(promo);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleModalSubmit = async (data: Promotion) => {
    try {
      if (modalMode === 'create') {
        await createPromotion(data);
      } else if (modalMode === 'edit' && editData) {
        await updatePromotion(editData.id, data);
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to save promotion:', error);
    }
  };
  
  const handleDeletePromotion = async () => {
    if (selectedPromotion) {
      try {
        await deletePromotion(selectedPromotion.id);
        setActionMenuAnchorEl(null);
        setSelectedPromotion(null);
        setDeleteConfirmOpen(false);
      } catch (error) {
        console.error('Failed to delete promotion:', error);
      }
    }
  };
  
  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, promotion: Promotion) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedPromotion(promotion);
  };
  
  const handleCloseActionMenu = () => {
    setActionMenuAnchorEl(null);
  };
  
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };
  
  const handleFilterSelect = (filter: string | null) => {
    setActiveFilter(filter);
    setFilterAnchorEl(null);
    setPage(0); // Reset to first page when filter changes
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter promotions based on search term and active filter
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = searchTerm === '' || 
      promo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (activeFilter === 'active') {
      return new Date(promo.endDate) > new Date();
    } else if (activeFilter === 'expired') {
      return new Date(promo.endDate) <= new Date();
    } else if (activeFilter === 'stackable') {
      return promo.stackable === true;
    } else {
      return true;
    }
  });
  
  // Paginate the filtered promotions
  const paginatedPromotions = filteredPromotions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Promotions</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAdd}
          sx={{ borderRadius: 2 }}
        >
          New Promotion
        </Button>
      </Box>
      
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee', mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search promotions..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button 
                startIcon={<FilterListIcon />}
                onClick={handleOpenFilterMenu}
                color={activeFilter ? 'primary' : 'inherit'}
                variant={activeFilter ? 'outlined' : 'text'}
                size="small"
              >
                {activeFilter ? activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) : 'Filter'}
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleCloseFilterMenu}
              >
                <MenuItem onClick={() => handleFilterSelect(null)} selected={activeFilter === null}>
                  All Promotions
                </MenuItem>
                <MenuItem onClick={() => handleFilterSelect('active')} selected={activeFilter === 'active'}>
                  Active
                </MenuItem>
                <MenuItem onClick={() => handleFilterSelect('expired')} selected={activeFilter === 'expired'}>
                  Expired
                </MenuItem>
                <MenuItem onClick={() => handleFilterSelect('stackable')} selected={activeFilter === 'stackable'}>
                  Stackable
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredPromotions.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {searchTerm || activeFilter ? 'No promotions match your search criteria.' : 'No promotions found.'}
              </Typography>
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
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Stackable</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPromotions.map((promo) => {
                      const isActive = new Date(promo.endDate) > new Date();
                      return (
                        <TableRow key={promo.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {promo.name || promo.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {promo.type.charAt(0).toUpperCase() + promo.type.slice(1)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {promo.value}{promo.type === 'percentage' ? '%' : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {isActive ? (
                              <Chip 
                                size="small" 
                                label="Active" 
                                color="success" 
                                variant="outlined"
                                icon={<CheckCircleIcon fontSize="small" />}
                              />
                            ) : (
                              <Chip 
                                size="small" 
                                label="Expired" 
                                color="default" 
                                variant="outlined"
                                icon={<CancelIcon fontSize="small" />}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(promo.startDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(promo.endDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {promo.stackable ? 'Yes' : 'No'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEdit(promo)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More options">
                              <IconButton 
                                size="small" 
                                onClick={(e) => handleOpenActionMenu(e, promo)}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredPromotions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>
      {/* Promotion Form Dialog */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
        <PromotionFormPage
          open={modalOpen}
          onClose={handleModalClose}
          standalone={true}
        />
      </Dialog>
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => {
          if (selectedPromotion) handleEdit(selectedPromotion);
          handleCloseActionMenu();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteConfirmOpen(true);
          handleCloseActionMenu();
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Are you sure you want to delete this promotion? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeletePromotion}>
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PromotionListPage;
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { usePromotionContext } from '../context/PromotionContext';
import type { CartItem } from '../types/promotion';

const productCategories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'books', name: 'Books' },
  { id: 'toys', name: 'Toys' },
];

const sampleProducts = [
  { id: '1', name: 'Smartphone', price: 499.99, category: 'electronics' },
  { id: '2', name: 'Laptop', price: 899.99, category: 'electronics' },
  { id: '3', name: 'T-shirt', price: 19.99, category: 'clothing' },
  { id: '4', name: 'Jeans', price: 49.99, category: 'clothing' },
  { id: '5', name: 'Bread', price: 2.99, category: 'groceries' },
  { id: '6', name: 'Milk', price: 1.99, category: 'groceries' },
  { id: '7', name: 'Novel', price: 12.99, category: 'books' },
  { id: '8', name: 'Textbook', price: 79.99, category: 'books' },
  { id: '9', name: 'Action Figure', price: 14.99, category: 'toys' },
  { id: '10', name: 'Board Game', price: 29.99, category: 'toys' },
];

const CartEvaluationPage = () => {
  const { cart, addToCart, removeFromCart, updateCart, clearCart, evaluateCart, evaluationResult, loading } = usePromotionContext();
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [userType, setUserType] = useState('regular');
  const [clientId, setClientId] = useState('1');

  // Implement updateCartItemQuantity
  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    const updatedItems = cart.items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart({ items: updatedItems });
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const product = sampleProducts.find(p => p.id === selectedProduct);
      if (product) {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          category: product.category,
        };
        addToCart(cartItem);
        setSelectedProduct('');
        setQuantity(1);
      }
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleEvaluateCart = () => {
    evaluateCart(cart);
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const discount = evaluationResult ? evaluationResult.discount : 0;
  const total = subtotal - discount;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingCartIcon sx={{ mr: 1 }} /> Cart Evaluation
      </Typography>

      <Grid container spacing={3}>
        {/* Product Selection */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Add Products</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Product</InputLabel>
              <Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value as string)}
                label="Select Product"
              >
                {sampleProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{ inputProps: { min: 1 } }}
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              startIcon={<AddIcon />}
              onClick={handleAddToCart}
              disabled={!selectedProduct}
            >
              Add to Cart
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={userType}
                onChange={(e) => setUserType(e.target.value as string)}
                label="User Type"
              >
                <MenuItem value="regular">Regular Customer</MenuItem>
                <MenuItem value="new">New Customer</MenuItem>
                <MenuItem value="premium">Premium Customer</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Client</InputLabel>
              <Select
                value={clientId}
                onChange={(e) => setClientId(e.target.value as string)}
                label="Client"
              >
                <MenuItem value="1">Fashion Store</MenuItem>
                <MenuItem value="2">Electronics Mart</MenuItem>
                <MenuItem value="3">Grocery World</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              onClick={handleEvaluateCart}
              disabled={cart.items.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <ReceiptIcon />}
            >
              {loading ? 'Processing...' : 'Evaluate Promotions'}
            </Button>
          </Paper>
        </Grid>

        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Shopping Cart</Typography>
              {cart.items.length > 0 && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              )}
            </Box>

            {cart.items.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Your cart is empty. Add some products to evaluate promotions.
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={productCategories.find(c => c.id === item.category)?.name || item.category} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Order Summary */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Discount" 
                      secondary={evaluationResult ? `${evaluationResult.appliedPromotions.length} promotions applied` : 'No promotions applied'} 
                    />
                    <Typography variant="body1" color="error">
                      -${discount.toFixed(2)}
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Applied Promotions */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #eee', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Applied Promotions</Typography>
                {!evaluationResult ? (
                  <Alert severity="info">
                    Click "Evaluate Promotions" to see applicable discounts.
                  </Alert>
                ) : evaluationResult.appliedPromotions.length === 0 ? (
                  <Alert severity="warning">
                    No promotions applicable to this cart.
                  </Alert>
                ) : (
                  <List>
                    {evaluationResult.appliedPromotions.map((promo, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="subtitle1" color="primary">
                            {promo.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {promo.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={promo.type.charAt(0).toUpperCase() + promo.type.slice(1)} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartEvaluationPage;
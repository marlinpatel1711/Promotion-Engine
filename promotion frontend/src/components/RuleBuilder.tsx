import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  type SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import type { PromotionRule, PromotionAction, PromotionCondition } from '../types/promotion';

export type RuleEffect = {
  id: string;
  itemList: string;
  discountName: string;
  discountValue: string;
};

interface RuleBuilderProps {
  onChange: (rules: PromotionRule[]) => void;
  initialRules?: PromotionRule[];
  mode?: 'simple' | 'advanced';
}

const RuleBuilder = ({ onChange, initialRules = [], mode = 'simple' }: RuleBuilderProps) => {
  const [rules, setRules] = useState<PromotionRule[]>(initialRules.length > 0 ? initialRules : [
    { 
      conditions: [{ type: 'minCartValue', value: 0 }],
      actions: [{ type: 'percentage', value: 10 }]
    }
  ]);

  useEffect(() => {
    if (initialRules.length > 0) {
      setRules(initialRules);
    }
  }, [initialRules]);

  const handleAddRule = () => {
    const newRules = [...rules, { 
      conditions: [{ type: 'minCartValue', value: 0 }],
      actions: [{ type: 'percentage', value: 10 }]
    }];
    setRules(newRules as PromotionRule[]);
    onChange(newRules as PromotionRule[]);
  };

  const handleRemoveRule = (ruleIndex: number) => {
    const newRules = rules.filter((_, i) => i !== ruleIndex);
    setRules(newRules);
    onChange(newRules);
  };

  const handleAddCondition = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].conditions.push({ type: 'minCartValue', value: 0 });
    setRules(newRules);
    onChange(newRules);
  };

  const handleRemoveCondition = (ruleIndex: number, conditionIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].conditions = newRules[ruleIndex].conditions.filter((_, i) => i !== conditionIndex);
    setRules(newRules);
    onChange(newRules);
  };

  const handleConditionChange = (ruleIndex: number, conditionIndex: number, field: keyof PromotionCondition, value: unknown) => {
    const newRules = [...rules];
    newRules[ruleIndex].conditions[conditionIndex] = { 
      ...newRules[ruleIndex].conditions[conditionIndex], 
      [field]: value 
    };
    setRules(newRules);
    onChange(newRules);
  };

  const handleAddAction = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].actions.push({ type: 'percentage', value: 10 });
    setRules(newRules);
    onChange(newRules);
  };

  const handleRemoveAction = (ruleIndex: number, actionIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].actions = newRules[ruleIndex].actions.filter((_, i) => i !== actionIndex);
    setRules(newRules);
    onChange(newRules);
  };

  const handleActionChange = (ruleIndex: number, actionIndex: number, field: keyof PromotionAction, value: unknown) => {
    const newRules = [...rules];
    newRules[ruleIndex].actions[actionIndex] = { 
      ...newRules[ruleIndex].actions[actionIndex], 
      [field]: value 
    };
    setRules(newRules);
    onChange(newRules);
  };

  // Define condition types and their labels
  const conditionTypes = [
    { value: 'minCartValue', label: 'Minimum Cart Value' },
    { value: 'userType', label: 'User Type' },
    { value: 'category', label: 'Product Category' },
    { value: 'quantity', label: 'Product Quantity' },
    { value: 'firstPurchase', label: 'First Purchase' },
    { value: 'dateRange', label: 'Date Range' }
  ];

  // Define action types and their labels
  const actionTypes = [
    { value: 'percentage', label: 'Percentage Discount' },
    { value: 'fixed', label: 'Fixed Amount Discount' },
    { value: 'bogo', label: 'Buy One Get One' },
    { value: 'freeShipping', label: 'Free Shipping' },
    { value: 'giftProduct', label: 'Free Gift Product' }
  ];

  // Render condition fields based on condition type
  const renderConditionFields = (condition: PromotionCondition, ruleIndex: number, conditionIndex: number) => {
    switch (condition.type) {
      case 'minCartValue':
        return (
          <TextField
            fullWidth
            label="Minimum Amount"
            type="number"
            value={condition.value}
            onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'value', Number(e.target.value))}
            InputProps={{ startAdornment: '₹' }}
            size="small"
          />
        );
      case 'userType':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>User Type</InputLabel>
            <Select
              value={condition.value || ''}
              label="User Type"
              onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'value', e.target.value)}
            >
              <MenuItem value="new">New User</MenuItem>
              <MenuItem value="returning">Returning User</MenuItem>
              <MenuItem value="premium">Premium User</MenuItem>
            </Select>
          </FormControl>
        );
      case 'category':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={condition.value || ''}
              label="Category"
              onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'value', e.target.value)}
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="groceries">Groceries</MenuItem>
              <MenuItem value="furniture">Furniture</MenuItem>
            </Select>
          </FormControl>
        );
      case 'quantity':
        return (
          <TextField
            fullWidth
            label="Minimum Quantity"
            type="number"
            value={condition.value}
            onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'value', Number(e.target.value))}
            size="small"
          />
        );
      case 'firstPurchase':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>First Purchase</InputLabel>
            <Select
              value={condition.value ? 'true' : 'false'}
              label="First Purchase"
              onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'value', e.target.value === 'true')}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        );
      case 'dateRange':
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={condition.startDate || ''}
                onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={condition.endDate || ''}
                onChange={(e) => handleConditionChange(ruleIndex, conditionIndex, 'endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  // Render action fields based on action type
  const renderActionFields = (action: PromotionAction, ruleIndex: number, actionIndex: number) => {
    switch (action.type) {
      case 'percentage':
        return (
          <TextField
            fullWidth
            label="Discount Percentage"
            type="number"
            value={action.value}
            onChange={(e) => handleActionChange(ruleIndex, actionIndex, 'value', Number(e.target.value))}
            InputProps={{ endAdornment: '%' }}
            size="small"
          />
        );
      case 'fixed':
        return (
          <TextField
            fullWidth
            label="Discount Amount"
            type="number"
            value={action.value}
            onChange={(e) => handleActionChange(ruleIndex, actionIndex, 'value', Number(e.target.value))}
            InputProps={{ startAdornment: '₹' }}
            size="small"
          />
        );
      case 'bogo':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Buy X Get Y</InputLabel>
            <Select
              value={action.value || 'buy1get1'}
              label="Buy X Get Y"
              onChange={(e) => handleActionChange(ruleIndex, actionIndex, 'value', e.target.value)}
            >
              <MenuItem value="buy1get1">Buy 1 Get 1 Free</MenuItem>
              <MenuItem value="buy2get1">Buy 2 Get 1 Free</MenuItem>
              <MenuItem value="buy3get1">Buy 3 Get 1 Free</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Promotion Rules</Typography>
        <Tooltip title="Rules define when and how promotions are applied">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {rules.map((rule, ruleIndex) => (
        <Card 
          key={ruleIndex} 
          elevation={0} 
          sx={{ 
            mb: 3, 
            border: '1px solid #eee', 
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            <Chip 
              label={`Rule ${ruleIndex + 1}`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          <CardContent>
            {/* Conditions Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Conditions (When to apply)
              </Typography>
              
              {rule.conditions.map((condition, conditionIndex) => (
                <Box 
                  key={conditionIndex} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 1,
                    position: 'relative'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Condition Type</InputLabel>
                        <Select
                          value={condition.type}
                          label="Condition Type"
                          onChange={(e: SelectChangeEvent) => 
                            handleConditionChange(ruleIndex, conditionIndex, 'type', e.target.value)
                          }
                        >
                          {conditionTypes.map(type => (
                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {renderConditionFields(condition, ruleIndex, conditionIndex)}
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                      <IconButton 
                        onClick={() => handleRemoveCondition(ruleIndex, conditionIndex)} 
                        color="error"
                        size="small"
                        disabled={rule.conditions.length <= 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => handleAddCondition(ruleIndex)} 
                size="small"
                sx={{ mt: 1 }}
              >
                Add Condition
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Actions Section */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Actions (What to apply)
              </Typography>
              
              {rule.actions.map((action, actionIndex) => (
                <Box 
                  key={actionIndex} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 1 
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Action Type</InputLabel>
                        <Select
                          value={action.type}
                          label="Action Type"
                          onChange={(e: SelectChangeEvent) => 
                            handleActionChange(ruleIndex, actionIndex, 'type', e.target.value)
                          }
                        >
                          {actionTypes.map(type => (
                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      {renderActionFields(action, ruleIndex, actionIndex)}
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                      <IconButton 
                        onClick={() => handleRemoveAction(ruleIndex, actionIndex)} 
                        color="error"
                        size="small"
                        disabled={rule.actions.length <= 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => handleAddAction(ruleIndex)} 
                size="small"
                sx={{ mt: 1 }}
              >
                Add Action
              </Button>
            </Box>
            
            {rules.length > 1 && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  onClick={() => handleRemoveRule(ruleIndex)}
                  size="small"
                >
                  Remove Rule
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Button 
        variant="outlined" 
        startIcon={<AddIcon />} 
        onClick={handleAddRule}
        sx={{ mt: 1 }}
      >
        Add Rule
      </Button>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          How Rules Work
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Each rule consists of conditions and actions. When all conditions in a rule are met, 
          all actions in that rule will be applied. Multiple rules can be created for complex promotion scenarios.
        </Typography>
      </Box>
    </Box>
  );
};

export default RuleBuilder;
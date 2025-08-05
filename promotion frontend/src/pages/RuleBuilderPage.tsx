import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import RuleBuilder from '../components/RuleBuilder';
import { fetchPromotions } from '../services/promotionService';

type PromotionRule = {
  conditions: any[];
  actions: any[];
};

const RuleBuilderPage = () => {
  const [rules, setRules] = useState<PromotionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [modalRules, setModalRules] = useState<PromotionRule>({ conditions: [], actions: [] });

  useEffect(() => {
    fetchPromotions().then((promos: any[]) => {
      setRules(promos.map(p => p.rule_json || { conditions: [], actions: [] }));
    }).finally(() => setLoading(false));
  }, []);

  const handleDeleteRuleSet = (idx: number) => {
    setRules(rules => rules.filter((_, i) => i !== idx));
  };

  // Modal logic for add/update
  const openModal = (idx: number | null) => {
    setModalIdx(idx);
    setModalRules(idx !== null ? rules[idx] : { conditions: [], actions: [] });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalIdx(null);
    setModalRules({ conditions: [], actions: [] });
  };
  const handleModalRuleChange = (newRules: PromotionRule[]) => {
    setModalRules(newRules[0] || { conditions: [], actions: [] });
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Rule Builder</Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : rules.length === 0 ? (
        <Typography color="text.secondary">No rules found.</Typography>
      ) : (
        <Stack spacing={3}>
          {rules.map((effects, idx) => (
            <Paper key={idx} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Rule Set {idx + 1}</Typography>
                <Button color="error" onClick={() => handleDeleteRuleSet(idx)}>Delete</Button>
              </Stack>
              <RuleBuilder initialRules={[modalRules]} onChange={handleModalRuleChange} />
              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="outlined" onClick={() => openModal(idx)}>Update</Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      <Button sx={{ mt: 3 }} variant="contained" onClick={() => openModal(null)}>Add New Rule Set</Button>
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle>{modalIdx !== null ? 'Update Rule Set' : 'Add Rule Set'}</DialogTitle>
        <DialogContent>
          <RuleBuilder initialRules={[modalRules]} onChange={handleModalRuleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={() => {
            if (modalIdx !== null) {
              setRules(rules => rules.map((r, i) => (i === modalIdx ? modalRules : r)));
            } else {
              setRules(rules => [...rules, modalRules]);
            }
            closeModal();
          }} variant="contained">{modalIdx !== null ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RuleBuilderPage; 
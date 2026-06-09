import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../services/api';
import toast from 'react-hot-toast';

const LEADS_KEY = 'leads';
const STATS_KEY = 'leadStats';

export const useLeads = (params) =>
  useQuery({
    queryKey: [LEADS_KEY, params],
    queryFn: () => leadsApi.getAll(params),
    keepPreviousData: true,
    staleTime: 30_000,
  });

export const useLead = (id) =>
  useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: () => leadsApi.getOne(id),
    enabled: !!id,
  });

export const useLeadStats = () =>
  useQuery({
    queryKey: [STATS_KEY],
    queryFn: leadsApi.getStats,
    staleTime: 60_000,
  });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Lead created successfully!');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => leadsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Lead updated!');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leadsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Lead deleted');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useBulkUpdateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }) => leadsApi.bulkUpdateStatus(ids, status),
    onSuccess: (_, { ids }) => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success(`${ids.length} leads updated`);
    },
    onError: (err) => toast.error(err.message),
  });
};

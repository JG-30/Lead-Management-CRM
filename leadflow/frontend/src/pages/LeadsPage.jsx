import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { STATUSES, getInitials, getAvatarColor, formatDate } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import LeadModal from '../components/LeadModal';
import DeleteModal from '../components/DeleteModal';

const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState([]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Sync status from URL
  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  const params = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== 'All' && { status: statusFilter }),
    sort,
    order,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isFetching } = useLeads(params);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads = data?.data || [];
  const pagination = data?.pagination || {};

  const handleSubmit = async (formData) => {
    if (editLead?._id) {
      await updateMutation.mutateAsync({ id: editLead._id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setShowModal(false);
    setEditLead(null);
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
    setDeleteTarget(null);
  };

  const handleEdit = (lead) => { setEditLead(lead); setShowModal(true); };
  const handleAdd = () => { setEditLead(null); setShowModal(true); };

  const toggleSort = (field) => {
    if (sort === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSort(field); setOrder('desc'); }
  };

  const SortIcon = ({ field }) => (
    <span className={`ml-1 text-xs ${sort === field ? 'text-accent' : 'text-text-muted'}`}>
      {sort === field ? (order === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === leads.length ? [] : leads.map(l => l._id));

  return (
    <div className="p-6 space-y-5 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">All Leads</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {pagination.total || 0} leads total
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search name, email, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-8 w-60"
          />
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); setSearchParams(s !== 'All' ? { status: s } : {}); }}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer font-medium ${
              statusFilter === s
                ? 'bg-accent/10 border-accent/30 text-accent'
                : 'bg-transparent border-border text-text-secondary hover:border-border/80 hover:text-text-primary'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={`${sort}_${order}`}
            onChange={e => { const [f, o] = e.target.value.split('_'); setSort(f); setOrder(o); setPage(1); }}
            className="input-base py-1.5 text-xs w-auto"
          >
            <option value="createdAt_desc">Newest first</option>
            <option value="createdAt_asc">Oldest first</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`card overflow-hidden transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        {isLoading ? (
          <div className="p-12 text-center text-text-muted text-sm">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3 opacity-30">🔍</div>
            <p className="text-text-secondary font-medium">No leads found</p>
            <p className="text-text-muted text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-tertiary border-b border-border">
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" checked={selected.length === leads.length && leads.length > 0} onChange={toggleAll} className="accent-accent" />
                    </th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3 cursor-pointer" onClick={() => toggleSort('name')}>
                      Lead <SortIcon field="name" />
                    </th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Company</th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Phone</th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Source</th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3 cursor-pointer" onClick={() => toggleSort('createdAt')}>
                      Created <SortIcon field="createdAt" />
                    </th>
                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Notes</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => {
                    const av = getAvatarColor(lead.name);
                    return (
                      <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-bg-tertiary/40 transition-colors">
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.includes(lead._id)} onChange={() => toggleSelect(lead._id)} className="accent-accent" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-mono flex-shrink-0" style={{ background: av.bg, color: av.color }}>
                              {getInitials(lead.name)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{lead.name}</div>
                              <div className="text-xs text-text-muted">{lead.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{lead.company || '—'}</td>
                        <td className="px-4 py-3 text-xs font-mono text-text-secondary">{lead.phone || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                        <td className="px-4 py-3 text-xs text-text-secondary">{lead.source || '—'}</td>
                        <td className="px-4 py-3 text-xs font-mono text-text-muted">{formatDate(lead.createdAt)}</td>
                        <td className="px-4 py-3 max-w-[140px]">
                          <span className="text-xs text-text-secondary truncate block" title={lead.notes}>{lead.notes || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleEdit(lead)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-colors">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => setDeleteTarget(lead)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-muted hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/10 transition-colors">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <div className="text-xs text-text-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} of {pagination.total} leads
                {selected.length > 0 && <span className="ml-3 text-accent font-medium">{selected.length} selected</span>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPrev} className="px-2.5 py-1.5 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border text-xs font-mono transition-colors ${p === page ? 'bg-accent border-accent text-white' : 'border-border text-text-secondary hover:bg-bg-tertiary'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNext} className="px-2.5 py-1.5 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <LeadModal
          lead={editLead}
          onClose={() => { setShowModal(false); setEditLead(null); }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          lead={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

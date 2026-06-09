import { NavLink } from 'react-router-dom';
import { useLeadStats } from '../hooks/useLeads';

const NavItem = ({ to, icon, label, badge, badgeColor = 'bg-accent text-white' }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors mb-0.5 ${
        isActive
          ? 'bg-accent/10 text-accent font-medium'
          : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
      }`
    }
  >
    {icon}
    <span className="flex-1">{label}</span>
    {badge != null && (
      <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded-full ${badgeColor}`}>
        {badge}
      </span>
    )}
  </NavLink>
);

export default function Sidebar() {
  const { data: stats } = useLeadStats();
  const s = stats?.data?.byStatus || {};
  const total = stats?.data?.total || 0;

  return (
    <aside className="w-[210px] bg-bg-secondary border-r border-border flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold font-mono text-sm">LF</div>
          <div>
            <div className="text-sm font-semibold tracking-tight">LeadFlow</div>
            <div className="text-xs text-text-muted">CRM Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-2.5 flex-1">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 py-1.5 mt-1">Main</p>
        <NavItem
          to="/"
          label="Dashboard"
          badge={total}
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
        />
        <NavItem
          to="/leads"
          label="All Leads"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />

        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 py-1.5 mt-3">By Status</p>
        <NavItem to="/leads?status=New"       label="New"       badge={s.New}       badgeColor="bg-blue-400/20 text-blue-400"   icon={<span className="w-2 h-2 rounded-full bg-blue-400" />} />
        <NavItem to="/leads?status=Contacted" label="Contacted" badge={s.Contacted} badgeColor="bg-amber-400/20 text-amber-400"  icon={<span className="w-2 h-2 rounded-full bg-amber-400" />} />
        <NavItem to="/leads?status=Qualified" label="Qualified" badge={s.Qualified} badgeColor="bg-purple-400/20 text-purple-400" icon={<span className="w-2 h-2 rounded-full bg-purple-400" />} />
        <NavItem to="/leads?status=Converted" label="Converted" badge={s.Converted} badgeColor="bg-green-400/20 text-green-400"  icon={<span className="w-2 h-2 rounded-full bg-green-400" />} />
        <NavItem to="/leads?status=Lost"      label="Lost"      badge={s.Lost}      badgeColor="bg-red-400/20 text-red-400"     icon={<span className="w-2 h-2 rounded-full bg-red-400" />} />

        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 py-1.5 mt-3">Analytics</p>
        <NavItem
          to="/analytics"
          label="Reports"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
        />
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="text-xs text-text-muted text-center">LeadFlow v1.0.0</div>
      </div>
    </aside>
  );
}

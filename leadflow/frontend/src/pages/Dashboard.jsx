import { useLeadStats } from '../hooks/useLeads';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/constants';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, color, sub }) => (
  <div className="card p-4">
    <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{label}</div>
    <div className={`text-3xl font-semibold font-mono tracking-tight ${color}`}>{value}</div>
    {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
  </div>
);

const PIE_COLORS = { New: '#60a5fa', Contacted: '#fbbf24', Qualified: '#c084fc', Converted: '#4ade80', Lost: '#f87171' };

export default function Dashboard() {
  const { data, isLoading } = useLeadStats();
  const stats = data?.data;

  if (isLoading) return <div className="p-8 text-text-muted">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-text-muted">No data available.</div>;

  const pieData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  const barData = stats.monthlyTrend?.map(m => ({
    name: new Date(m._id.year, m._id.month - 1).toLocaleString('en', { month: 'short' }),
    leads: m.count,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-text-muted mt-0.5">Overview of your lead pipeline</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Total Leads"  value={stats.total}              color="text-text-primary" sub="All time" />
        <StatCard label="New"          value={stats.byStatus.New}        color="text-blue-400"    sub="Awaiting contact" />
        <StatCard label="Qualified"    value={stats.byStatus.Qualified}  color="text-purple-400"  sub="In pipeline" />
        <StatCard label="Converted"    value={stats.byStatus.Converted}  color="text-green-400"   sub="Won" />
        <StatCard label="Win Rate"     value={`${stats.winRate}%`}       color="text-teal-400"    sub="Conversion rate" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="card p-4 col-span-2">
          <h2 className="text-sm font-semibold mb-4">Monthly Lead Trend</h2>
          {barData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={24}>
                <XAxis dataKey="name" tick={{ fill: '#5a6278', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5a6278', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1a1d24', border: '1px solid #2a2e3a', borderRadius: 8, color: '#e8eaf0' }} />
                <Bar dataKey="leads" fill="#4f7cff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">No trend data yet</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold mb-4">Status Distribution</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1d24', border: '1px solid #2a2e3a', borderRadius: 8, color: '#e8eaf0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[d.name] }} />
                      <span className="text-text-secondary">{d.name}</span>
                    </div>
                    <span className="font-mono text-text-primary">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-32 flex items-center justify-center text-text-muted text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Leads</h2>
          <Link to="/leads" className="text-xs text-accent hover:underline">View all →</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              {['Name', 'Company', 'Status', 'Added'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3 border-b border-border bg-bg-tertiary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentLeads?.map(lead => (
              <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-bg-tertiary/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium">{lead.name}</td>
                <td className="px-5 py-3 text-sm text-text-secondary">{lead.company || '—'}</td>
                <td className="px-5 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-5 py-3 text-xs font-mono text-text-muted">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

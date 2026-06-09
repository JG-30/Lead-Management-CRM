export const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export const STATUS_CONFIG = {
  New:       { color: 'text-blue-400',   bg: 'bg-blue-400/10',   dot: '#60a5fa' },
  Contacted: { color: 'text-amber-400',  bg: 'bg-amber-400/10',  dot: '#fbbf24' },
  Qualified: { color: 'text-purple-400', bg: 'bg-purple-400/10', dot: '#c084fc' },
  Converted: { color: 'text-green-400',  bg: 'bg-green-400/10',  dot: '#4ade80' },
  Lost:      { color: 'text-red-400',    bg: 'bg-red-400/10',    dot: '#f87171' },
};

export const SOURCES = ['Website', 'Referral', 'Cold Call', 'Email', 'Social Media', 'Event', 'Other'];

export const AVATAR_COLORS = [
  { bg: 'rgba(79,124,255,.2)',  color: '#4f7cff' },
  { bg: 'rgba(168,85,247,.2)', color: '#a855f7' },
  { bg: 'rgba(34,197,94,.2)',  color: '#22c55e' },
  { bg: 'rgba(245,158,11,.2)', color: '#f59e0b' },
  { bg: 'rgba(20,184,166,.2)', color: '#14b8a6' },
  { bg: 'rgba(239,68,68,.2)',  color: '#ef4444' },
];

export const getAvatarColor = (name = '') =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const getInitials = (name = '') =>
  name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

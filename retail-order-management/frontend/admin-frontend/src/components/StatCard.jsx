import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = '#4f46e5', trend, subtext }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <div style={{ backgroundColor: `${color}15`, color: color, padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
          <Icon size={20} />
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
          {value}
        </h3>
        {(trend || subtext) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            {trend && (
              <span className={`badge ${trend.startsWith('+') ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.15rem 0.4rem' }}>
                {trend}
              </span>
            )}
            {subtext && <span className="text-muted">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

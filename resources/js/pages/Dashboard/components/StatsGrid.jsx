import React from 'react';
import { Eye, Image as ImageIcon, Calendar } from 'lucide-react';
import { DS } from '../styles/dashboardStyles';

export default function StatsGrid({ stats, artworksCount, eventsCount, t }) {
  const data = [
    {
      icon:  <Eye size={20} color="#c5a059" />,
      value: stats.total_views ?? 0,
      label: t('dashboard.stat_views'),
    },
    {
      icon:  <ImageIcon size={20} color="#c5a059" />,
      value: artworksCount,
      label: t('dashboard.stat_artworks'),
    },
    {
      icon:  <Calendar size={20} color="#c5a059" />,
      value: eventsCount,
      label: 'Événements',
    },
  ];

  return (
    <div style={{ ...DS.statsGrid, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {data.map((s, i) => (
        <div key={i} style={DS.statCard}>
          <div style={{ marginBottom: 10 }}>{s.icon}</div>
          <h3 style={DS.statVal}>{s.value}</h3>
          <p style={DS.statLbl}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
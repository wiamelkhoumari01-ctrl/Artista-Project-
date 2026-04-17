import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie,
    Cell, Legend, AreaChart, Area,
} from 'recharts';
import api from '../../api';
import { useLanguage } from '../../context/LanguageContext';

const GOLD_COLORS = ['#c5a059', '#e8c97a', '#a07c3a', '#d4b06a', '#8c6a2e', '#f0d898'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#fff', borderRadius: 12,
            padding: '10px 16px',
            border: '1px solid rgba(197,160,89,0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
            <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '4px 0 0', fontWeight: 700, color: p.color || '#c5a059', fontSize: 14 }}>
                    {p.value} {p.name}
                </p>
            ))}
        </div>
    );
};

export default function AdminKpis() {
    const { locale } = useLanguage();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/admin/kpis')
            .then(res => { setData(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const registrationsFormatted = (data?.registrations || []).map(r => ({
        date: r.date ? new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '',
        total: r.total,
    }));

    return (
        <div className="page-analyse">
            <div className="conteneur-kpi">

                {/* Header */}
                <div className="en-tete-flex">
                    <div>
                        <p className="sur-titre">Administration</p>
                        <h1 className="titre-principal">Monitoring & Analyse des KPIs</h1>
                    </div>
                    <Link to="/admin/dashboard" className="bouton-retour">
                        ← Retour au Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="chargement-centre">
                        <div className="spinner-border" style={{ color: '#c5a059', width: 48, height: 48 }} />
                        <p style={{ marginTop: 16, color: '#aaa' }}>Chargement des données...</p>
                    </div>
                ) : (
                    <div className="grille-colonnes">

                        {/* Graphe 1 — Vues par artiste */}
                        <div className="carte-stat">
                            <div className="entete-carte">
                                <h2 className="titre-carte">Vues & Clics par Artiste</h2>
                                <span className="sous-titre-carte">Top 10 artistes les plus consultés</span>
                            </div>
                            {data?.views_by_artist?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={data.views_by_artist}
                                        margin={{ top: 8, right: 16, left: 0, bottom: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11, fill: '#bbb' }}
                                            axisLine={false}
                                            tickLine={false}
                                            angle={-35}
                                            textAnchor="end"
                                            interval={0}
                                        />
                                        <YAxis tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            wrapperStyle={{ fontSize: 10, paddingTop: 16 }}
                                            formatter={(value) => value === 'views' ? 'Vues' : value} 
                                        />
                                        <Bar 
                                            dataKey="views" 
                                            name="Vues" 
                                            fill="#c5a059" 
                                            radius={[6, 6, 0, 0]} 
                                            barSize={32} 
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <EmptyState />}
                        </div>

                        {/* Graphe 2 — Œuvres par catégorie */}
                        <div className="carte-stat">
                            <div className="entete-carte">
                                <h2 className="titre-carte">Répartition des Œuvres par Catégorie</h2>
                                <span className="sous-titre-carte">Distribution de toutes les œuvres publiées</span>
                            </div>
                            {data?.artworks_by_category?.length > 0 ? (
                                <div className="section-camembert">
                                    <ResponsiveContainer width="100%" height={280} style={{ minWidth: 260, flex: 1 }}>
                                        <PieChart>
                                            <Pie
                                                data={data.artworks_by_category}
                                                dataKey="total"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={110}
                                                innerRadius={55}
                                                paddingAngle={3}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={{ stroke: '#bbb', strokeWidth: 1 }}
                                            >
                                                {data.artworks_by_category.map((_, i) => (
                                                    <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [`${value} œuvre${value > 1 ? 's' : ''}`, name]}
                                                contentStyle={{ borderRadius: 12, border: '1px solid rgba(197,160,89,0.3)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="legende-liste">
                                        {data.artworks_by_category.map((cat, i) => (
                                            <div key={i} className="item-legende">
                                                <div className="pastille-couleur" style={{ background: GOLD_COLORS[i % GOLD_COLORS.length] }} />
                                                <span className="nom-categorie">{cat.name}</span>
                                                <span className="valeur-categorie">{cat.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : <EmptyState />}
                        </div>

                        {/* Graphe 3 — Inscriptions par jour */}
                        <div className="carte-stat">
                            <div className="entete-carte">
                                <h2 className="titre-carte">Nouvelles Inscriptions — 30 derniers jours</h2>
                                <span className="sous-titre-carte">Évolution du nombre d'utilisateurs inscrits</span>
                            </div>
                            {registrationsFormatted.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={registrationsFormatted} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#c5a059" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: '#bbb' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: '#bbb' }}
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                            width={28}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            name="Inscriptions"
                                            stroke="#c5a059"
                                            strokeWidth={2.5}
                                            fill="url(#regGrad)"
                                            dot={{ r: 3, fill: '#c5a059', strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="etat-vide">
                                    <span style={{ fontSize: 32 }}>📋</span>
                                    <p style={{ color: '#bbb', margin: 0, fontSize: 14 }}>Aucune inscription ces 30 derniers jours.</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="etat-vide">
            <span style={{ fontSize: 36 }}>📊</span>
            <p style={{ margin: '12px 0 0', fontSize: 14 }}>Pas encore de données disponibles.</p>
        </div>
    );
}
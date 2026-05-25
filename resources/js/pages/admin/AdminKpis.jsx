import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie,
    Cell, Legend, AreaChart, Area,
} from 'recharts';
import api from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import '../../../css/AdminKpis.css';

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

    // ── États ─────────────────────────────────────────────────────────
    const [kpiData,    setKpiData]    = useState(null);
    const [reporting,  setReporting]  = useState([]);
    const [suppLog,    setSuppLog]    = useState([]);
    const [loadingKpi, setLoadingKpi] = useState(true);
    const [loadingRep, setLoadingRep] = useState(true);
    const [loadingLog, setLoadingLog] = useState(true);
    const [activeTab,  setActiveTab]  = useState('reporting'); // 'reporting' | 'log'

    // ── Chargement des 3 sources en parallèle ─────────────────────────
    useEffect(() => {
        // 1. KPIs graphiques (existant)
        api.get('/api/admin/kpis')
            .then(res => setKpiData(res.data))
            .finally(() => setLoadingKpi(false));

        // 2. Reporting via la VUE SQL
        api.get('/api/admin/reporting?limit=20')
            .then(res => setReporting(res.data.data || []))
            .finally(() => setLoadingRep(false));

        // 3. Log via le TRIGGER SQL
        api.get('/api/admin/suppression-log')
            .then(res => setSuppLog(res.data.data || []))
            .finally(() => setLoadingLog(false));
    }, []);

    const registrationsFormatted = (kpiData?.registrations || []).map(r => ({
        date:  r.date ? new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '',
        total: r.total,
    }));

    return (
        <div className="page-analyse">
            <div className="conteneur-kpi">

                {/* ── Header ── */}
                <div className="en-tete-flex">
                    <div>
                        <p className="sur-titre">Administration</p>
                        <h1 className="titre-principal">Monitoring & Analyse des KPIs</h1>
                    </div>
                    <Link to="/admin/dashboard" className="bouton-retour">
                        ← Retour au Dashboard
                    </Link>
                </div>

                {/* ══════════════════════════════════════════════════════
                    SECTION 1 — Les 3 graphiques existants
                ══════════════════════════════════════════════════════ */}
                {loadingKpi ? (
                    <div className="chargement-centre">
                        <div className="spinner-border" style={{ color: '#c5a059', width: 48, height: 48 }} />
                        <p style={{ marginTop: 16, color: '#aaa' }}>Chargement des données...</p>
                    </div>
                ) : (
                    <div className="grille-colonnes">

                        {/* Graphe 1 — Vues par artiste */}
                        <div className="carte-stat">
                            <div className="entete-carte">
                                <h2 className="titre-carte">Vues par Artiste</h2>
                                <span className="sous-titre-carte">Top 10 artistes les plus consultés</span>
                            </div>
                            {kpiData?.views_by_artist?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={kpiData.views_by_artist}
                                        margin={{ top: 8, right: 16, left: 0, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#bbb' }}
                                            axisLine={false} tickLine={false}
                                            angle={-35} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 16 }}
                                            formatter={(v) => v === 'views' ? 'Vues' : v} />
                                        <Bar dataKey="views" name="Vues" fill="#c5a059"
                                            radius={[6, 6, 0, 0]} barSize={32} />
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
                            {kpiData?.artworks_by_category?.length > 0 ? (
                                <div className="section-camembert">
                                    <ResponsiveContainer width="100%" height={280} style={{ minWidth: 260, flex: 1 }}>
                                        <PieChart>
                                            <Pie data={kpiData.artworks_by_category}
                                                dataKey="total" nameKey="name"
                                                cx="50%" cy="50%"
                                                outerRadius={110} innerRadius={55}
                                                paddingAngle={3}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={{ stroke: '#bbb', strokeWidth: 1 }}>
                                                {kpiData.artworks_by_category.map((_, i) => (
                                                    <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(v, n) => [`${v} œuvre${v > 1 ? 's' : ''}`, n]}
                                                contentStyle={{ borderRadius: 12, border: '1px solid rgba(197,160,89,0.3)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="legende-liste">
                                        {kpiData.artworks_by_category.map((cat, i) => (
                                            <div key={i} className="item-legende">
                                                <div className="pastille-couleur"
                                                    style={{ background: GOLD_COLORS[i % GOLD_COLORS.length] }} />
                                                <span className="nom-categorie">{cat.name}</span>
                                                <span className="valeur-categorie">{cat.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : <EmptyState />}
                        </div>

                        {/* Graphe 3 — Inscriptions */}
                        <div className="carte-stat">
                            <div className="entete-carte">
                                <h2 className="titre-carte">Nouvelles Inscriptions — 30 derniers jours</h2>
                                <span className="sous-titre-carte">Évolution du nombre d'utilisateurs inscrits</span>
                            </div>
                            {registrationsFormatted.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={registrationsFormatted}
                                        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%"  stopColor="#c5a059" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#bbb' }}
                                            axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#bbb' }}
                                            axisLine={false} tickLine={false}
                                            allowDecimals={false} width={28} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="total" name="Inscriptions"
                                            stroke="#c5a059" strokeWidth={2.5}
                                            fill="url(#regGrad)"
                                            dot={{ r: 3, fill: '#c5a059', strokeWidth: 0 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="etat-vide">
                                    <span style={{ fontSize: 32 }}>📋</span>
                                    <p style={{ color: '#bbb', margin: 0, fontSize: 14 }}>
                                        Aucune inscription ces 30 derniers jours.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    SECTION 2 — Tableaux SQL (Vue + Trigger)
                    Tabs pour switcher entre les deux sources
                ══════════════════════════════════════════════════════ */}
                <div className="sql-section">

                    {/* Entête avec badge explicatif */}
                    <div className="sql-section-header">
                        <div>
                            <h2 className="sql-section-titre">Données SQL Avancées</h2>
                            <p className="sql-section-desc">
                                Alimentées directement par la <span className="badge-sql vue">VUE</span> et
                                le <span className="badge-sql trigger">TRIGGER</span> MySQL créés via la migration.
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="sql-tabs">
                        <button
                            className={`sql-tab ${activeTab === 'reporting' ? 'actif' : ''}`}
                            onClick={() => setActiveTab('reporting')}
                        >
                            <span className="badge-sql vue" style={{ marginRight: 8 }}>VUE</span>
                            Reporting Artistes
                            <span className="sql-tab-count">{reporting.length}</span>
                        </button>
                        <button
                            className={`sql-tab ${activeTab === 'log' ? 'actif' : ''}`}
                            onClick={() => setActiveTab('log')}
                        >
                            <span className="badge-sql trigger" style={{ marginRight: 8 }}>TRIGGER</span>
                            Log Suppressions
                            {suppLog.length > 0 && (
                                <span className="sql-tab-count alerte">{suppLog.length}</span>
                            )}
                        </button>
                    </div>

                    {/* ── Tab 1 : Reporting via la VUE SQL ── */}
                    {activeTab === 'reporting' && (
                        <div className="carte-stat" style={{ borderRadius: '0 20px 20px 20px' }}>
                            <div className="entete-carte">
                                <h2 className="titre-carte">Reporting Artistes</h2>
                                <span className="sous-titre-carte">
                                    Source : <code>artistes_stats_vue</code> — top 20 par vues (30j)
                                </span>
                            </div>

                            {loadingRep ? (
                                <div className="chargement-centre" style={{ padding: 40 }}>
                                    <div className="spinner-border" style={{ color: '#c5a059' }} />
                                </div>
                            ) : reporting.length === 0 ? (
                                <EmptyState message="Aucune donnée dans la vue SQL. Lancez la migration d'abord." />
                            ) : (
                                <div className="table-scroll">
                                    <table className="sql-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Artiste</th>
                                                <th>Email</th>
                                                <th>Ville / Pays</th>
                                                <th className="col-num">Vues totales</th>
                                                <th className="col-num">Vues 30j</th>
                                                <th className="col-num">Œuvres</th>
                                                <th className="col-num">Événements</th>
                                                <th>Inscrit le</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reporting.map((row, i) => (
                                                <tr key={row.artist_id}>
                                                    <td className="col-rank">
                                                        {i === 0 && <span className="medal">🥇</span>}
                                                        {i === 1 && <span className="medal">🥈</span>}
                                                        {i === 2 && <span className="medal">🥉</span>}
                                                        {i > 2 && <span style={{ color: '#bbb' }}>#{i + 1}</span>}
                                                    </td>
                                                    <td>
                                                        <span className="artiste-nom">
                                                            {row.nom_scene_fr || `${row.prenom} ${row.nom}`}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="email-cell">{row.email}</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: '#666', fontSize: 13 }}>
                                                            {[row.ville, row.pays].filter(Boolean).join(', ') || '—'}
                                                        </span>
                                                    </td>
                                                    <td className="col-num">
                                                        <span className="num-badge">{row.vues_totales ?? 0}</span>
                                                    </td>
                                                    <td className="col-num">
                                                        <span className="num-badge gold">
                                                            {row.vues_30_jours ?? 0}
                                                        </span>
                                                    </td>
                                                    <td className="col-num">
                                                        <span className="num-badge">{row.nb_artworks ?? 0}</span>
                                                    </td>
                                                    <td className="col-num">
                                                        <span className="num-badge">{row.nb_events ?? 0}</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: '#aaa', fontSize: 12 }}>
                                                            {row.inscrit_le
                                                                ? new Date(row.inscrit_le).toLocaleDateString('fr-FR')
                                                                : '—'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Tab 2 : Log suppressions via le TRIGGER ── */}
                    {activeTab === 'log' && (
                        <div className="carte-stat" style={{ borderRadius: '0 20px 20px 20px' }}>
                            <div className="entete-carte">
                                <h2 className="titre-carte">Historique des Suppressions</h2>
                                <span className="sous-titre-carte">
                                    Source : <code>artistes_suppression_log</code> —
                                    rempli automatiquement par le trigger MySQL à chaque DELETE
                                </span>
                            </div>

                            {loadingLog ? (
                                <div className="chargement-centre" style={{ padding: 40 }}>
                                    <div className="spinner-border" style={{ color: '#c5a059' }} />
                                </div>
                            ) : suppLog.length === 0 ? (
                                <div className="etat-vide">
                                    <span style={{ fontSize: 40 }}>🗑️</span>
                                    <p style={{ color: '#bbb', margin: '12px 0 4px', fontSize: 15, fontWeight: 600 }}>
                                        Aucune suppression enregistrée
                                    </p>
                                    <p style={{ color: '#ccc', margin: 0, fontSize: 13 }}>
                                        Le trigger SQL écrira automatiquement ici lors du prochain DELETE d'artiste.
                                    </p>
                                </div>
                            ) : (
                                <div className="table-scroll">
                                    <table className="sql-table">
                                        <thead>
                                            <tr>
                                                <th>ID Log</th>
                                                <th>Artiste supprimé</th>
                                                <th>Email</th>
                                                <th>Slug</th>
                                                <th className="col-num">Vues</th>
                                                <th>Supprimé le</th>
                                                <th>Raison</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {suppLog.map((row) => (
                                                <tr key={row.id}>
                                                    <td>
                                                        <span style={{ color: '#bbb', fontSize: 12 }}>#{row.id}</span>
                                                    </td>
                                                    <td>
                                                        <span className="artiste-nom">
                                                            {row.nom_scene_fr || '—'}
                                                        </span>
                                                        <span style={{ display: 'block', fontSize: 11, color: '#bbb' }}>
                                                            ID artist #{row.artist_id}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="email-cell">{row.email}</span>
                                                    </td>
                                                    <td>
                                                        <code style={{ fontSize: 12, color: '#888', background: '#f6efe6', padding: '2px 6px', borderRadius: 4 }}>
                                                            {row.slug}
                                                        </code>
                                                    </td>
                                                    <td className="col-num">
                                                        <span className="num-badge">{row.views_count ?? 0}</span>
                                                    </td>
                                                    <td>
                                                        <span className="date-suppression">
                                                            {row.supprime_le
                                                                ? new Date(row.supprime_le).toLocaleString('fr-FR', {
                                                                    day: '2-digit', month: 'short',
                                                                    year: 'numeric', hour: '2-digit', minute: '2-digit',
                                                                })
                                                                : '—'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="raison-badge">
                                                            {row.raison || 'Suppression manuelle'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>
                {/* fin sql-section */}

            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="etat-vide">
            <span style={{ fontSize: 36 }}>📊</span>
            <p style={{ margin: '12px 0 0', fontSize: 14, color: '#bbb' }}>
                {message || 'Pas encore de données disponibles.'}
            </p>
        </div>
    );
}

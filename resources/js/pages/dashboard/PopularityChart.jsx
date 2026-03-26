import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function PopularityChart({ data }) {
    return (
        <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
            <h4 className="text-serif mb-4">Évolution des vues (30 jours)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip 
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#c5a059" 
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
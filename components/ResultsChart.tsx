
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Player } from '../types';
import { VOTING_DECK } from '../constants';

interface ResultsChartProps {
    players: Player[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ResultsChart: React.FC<ResultsChartProps> = ({ players }) => {
    const data = useMemo(() => {
        const votes = players.reduce((acc, player) => {
            if (player.vote) {
                acc[player.vote] = (acc[player.vote] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return VOTING_DECK.filter(card => votes[card] > 0).map(card => ({
            name: card,
            votes: votes[card],
        })).sort((a,b) => VOTING_DECK.indexOf(a.name) - VOTING_DECK.indexOf(b.name));
    }, [players]);
    
    const numericVotes = players.map(p => p.vote && !isNaN(Number(p.vote)) ? Number(p.vote) : null).filter(v => v !== null) as number[];
    const average = numericVotes.length > 0 ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1) : 'N/A';

    if (data.length === 0) {
        return <div className="text-dark-text-secondary">No votes cast yet.</div>;
    }

    return (
        <div className="w-full h-64 sm:h-80 animate-reveal">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis allowDecimals={false} stroke="#9ca3af" />
                    <Tooltip 
                        cursor={{fill: 'rgba(107, 114, 128, 0.2)'}}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                        labelStyle={{ color: '#f9fafb' }}
                    />
                    <Bar dataKey="votes" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-dark-text-secondary mt-4">
                Average (numeric votes only): <span className="font-bold text-dark-text-primary">{average}</span>
            </p>
        </div>
    );
};

export default ResultsChart;

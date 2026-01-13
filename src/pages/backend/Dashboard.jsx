import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Building2, UserCheck, TrendingUp } from 'lucide-react';

export default function Dashboard({ profile }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    myClients: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { count: totalClients } = await supabase.from('clients').select('*', { count: 'exact', head: true });
    const { count: myClients } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('assigned_to', profile.id);
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    setStats({ totalClients, myClients, totalUsers });
  }

  const cards = [
    { label: 'Total Clienți', value: stats.totalClients, icon: Building2, color: 'bg-blue-500' },
    { label: 'Clienții Mei', value: stats.myClients, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Utilizatori Sistem', value: stats.totalUsers, icon: Users, color: 'bg-red-500' },
    { label: 'Activitate', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Activitate Recentă</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Client nou adăugat: SC TEST SRL</p>
                  <p className="text-xs text-gray-500">Acum 2 ore</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Notificări</h3>
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p>Nu există notificări noi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
